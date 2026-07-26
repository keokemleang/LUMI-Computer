import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { computeOrderTotals } from "@/lib/pricing";
import { getSettings, shippingConfigFromSettings } from "@/lib/settings";

// Cryptographically random, not derived from a timestamp — order numbers
// double as the payment reference sent to the KHQR provider, so they must
// not be guessable/enumerable (see webhook + status-endpoint security).
function genOrderNo() {
  const year = new Date().getFullYear();
  const random = randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
  return `LUMI-${year}-${random}`;
}

/**
 * Validates the shipping address + cart, recomputes pricing server-side
 * (never trust client-sent prices), and returns everything needed to
 * create an Order. Throws an Error with a user-facing message on
 * validation failure — callers should catch and return it as a 400.
 */
export async function prepareOrderFromCart(body) {
  const address = body?.address || {};
  const name = String(address?.name || "").trim();
  const phone = String(address?.phone || "").trim();
  const street = String(address?.street || "").trim();
  const city = String(address?.city || "").trim();
  const zip = String(address?.zip || "").trim();
  const country = String(address?.country || "").trim();
  const cartItems = Array.isArray(body?.items) ? body.items : [];

  if (!name || !street || !city || !country || !phone) {
    throw new Error("Please fill in your full shipping address");
  }
  if (cartItems.length === 0) {
    throw new Error("Your cart is empty");
  }

  const slugs = cartItems.map(i => String(i?.slug || ""));
  const products = await db.product.findMany({ where: { slug: { in: slugs } } });
  const productBySlug = new Map(products.map(p => [p.slug, p]));

  const items = [];
  let subtotal = 0;
  for (const ci of cartItems) {
    const product = productBySlug.get(String(ci?.slug || ""));
    if (!product) {
      throw new Error(`Unknown product: ${ci?.slug}`);
    }
    const qty = Math.max(1, Math.floor(Number(ci?.qty) || 1));
    if (qty > product.stock) {
      throw new Error(`Only ${product.stock} of "${product.name}" left in stock`);
    }
    items.push({ name: product.name, slug: product.slug, qty, price: product.price });
    subtotal += product.price * qty;
  }
  const settings = await getSettings();
  const { shipping, total } = computeOrderTotals(subtotal, shippingConfigFromSettings(settings));
  const amount = Math.round(total * 100) / 100;

  return {
    orderNo: genOrderNo(),
    items,
    subtotal,
    shipping,
    amount,
    shippingAddress: { name, phone, street, city, zip, country }
  };
}

// Atomic per-product decrement guarded by a `stock >= qty` WHERE clause, so
// the UPDATE itself either applies fully or not at all — no read-then-write
// gap for two concurrent orders to race the same last unit into negative
// stock. If stock has run out from under a concurrent order, this silently
// no-ops rather than going negative (the checkout-time check in
// prepareOrderFromCart already rejects the common case up front).
async function decrementStock(tx, items) {
  for (const item of items) {
    if (!item?.slug || !item?.qty) continue;
    await tx.product.updateMany({
      where: { slug: item.slug, stock: { gte: item.qty } },
      data: { stock: { decrement: item.qty } }
    });
  }
}

/**
 * Marks an order paid and decrements stock for each line item, atomically.
 * Safe to call more than once for the same order, and safe under
 * concurrent callers (e.g. the webhook and a status-poll racing each
 * other): the `updateMany` below is an atomic conditional update — it
 * flips paymentStatus only if it is still "pending", and Postgres's row
 * lock during the UPDATE means at most one concurrent caller can ever see
 * count > 0. A plain findUnique-then-update (the previous implementation)
 * does not have this guarantee under Read Committed isolation, since both
 * callers can read "pending" before either commits.
 */
export async function markOrderPaid(orderId) {
  return db.$transaction(async tx => {
    const { count } = await tx.order.updateMany({
      where: { id: orderId, paymentStatus: "pending" },
      data: { paymentStatus: "paid" }
    });

    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (count === 0 || !order) return order;

    await decrementStock(tx, JSON.parse(order.items || "[]"));
    return order;
  });
}

/**
 * Cash on Delivery has no upfront payment gate, so stock is reserved
 * (decremented) immediately when the order is placed rather than waiting
 * for a payment confirmation that will never come. paymentStatus stays
 * "pending" — it settles to "paid" only once the courier actually
 * collects cash on delivery, which is handled separately by an admin.
 */
export async function reserveStockForCod(orderId) {
  return db.$transaction(async tx => {
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order) return null;
    await decrementStock(tx, JSON.parse(order.items || "[]"));
    return order;
  });
}
