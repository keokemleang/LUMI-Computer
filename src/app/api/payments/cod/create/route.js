import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { prepareOrderFromCart, reserveStockForCod } from "@/lib/orders";
import { parseJsonBody } from "@/lib/parse-json";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req) {
  const limited = rateLimit(req, { key: "payments:create", limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: "You must be signed in to check out" }, { status: 401 });
    }

    const { body, errorResponse } = await parseJsonBody(req);
    if (errorResponse) return errorResponse;
    let prepared;
    try {
      prepared = await prepareOrderFromCart(body);
    } catch (err) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
    }
    const { orderNo, items, amount, shippingAddress } = prepared;

    const order = await db.order.create({
      data: {
        orderNo,
        userEmail: session.user.email,
        userName: session.user.name || shippingAddress.name,
        total: amount,
        items: JSON.stringify(items),
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod: "cod",
        paymentStatus: "pending",
        paymentRef: orderNo
      }
    });

    // COD has no upfront payment gate — reserve stock immediately.
    await reserveStockForCod(order.id);

    return NextResponse.json({
      ok: true,
      orderNo,
      amount
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
