import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createKhqrPayment } from "@/lib/khqr";
import { getSession } from "@/lib/session";
import { prepareOrderFromCart } from "@/lib/orders";
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
    const appUrl = process.env.APP_URL || "http://localhost:3000";

    const order = await db.order.create({
      data: {
        orderNo,
        userEmail: session.user.email,
        userName: session.user.name || shippingAddress.name,
        total: amount,
        items: JSON.stringify(items),
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod: "khqr",
        paymentStatus: "pending",
        paymentRef: orderNo
      }
    });

    let payment;
    try {
      payment = await createKhqrPayment({
        amount,
        reference: orderNo,
        successUrl: `${appUrl}/checkout/success?ref=${orderNo}`,
        webhookUrl: `${appUrl}/api/webhooks/khqr`
      });
    } catch (err) {
      await db.order.update({ where: { id: order.id }, data: { paymentStatus: "failed" } });
      return NextResponse.json({ ok: false, error: err.message || "Failed to create KHQR payment" }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      orderNo,
      reference: orderNo,
      amount: payment.amount ?? amount,
      qrCode: payment.qr_code,
      paymentUrl: payment.payment_url,
      expiresIn: payment.expires_in
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
