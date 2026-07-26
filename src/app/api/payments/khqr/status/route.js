import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkKhqrTransaction } from "@/lib/khqr";
import { markOrderPaid } from "@/lib/orders";
import { getSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";

const REMOTE_STATUS_MAP = {
  Success: "paid",
  Pending: "pending",
  Expired: "expired"
};

export async function GET(req) {
  const limited = rateLimit(req, { key: "payments:khqr:status", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reference = new URL(req.url).searchParams.get("reference");
    if (!reference) {
      return NextResponse.json({ ok: false, error: "Missing reference" }, { status: 400 });
    }

    const order = await db.order.findUnique({ where: { paymentRef: reference } });
    if (!order) {
      return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    }

    const isOwner = order.userEmail === session.user.email;
    const isAdmin = session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      // Same response shape as "not found" — don't reveal that an order exists to non-owners.
      return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    }

    // Once settled (paid/expired/failed) trust the local record — no need to keep polling the provider.
    if (order.paymentStatus !== "pending") {
      return NextResponse.json({ ok: true, status: order.paymentStatus, orderNo: order.orderNo });
    }

    const remote = await checkKhqrTransaction(reference);
    const status = REMOTE_STATUS_MAP[remote.status] || "pending";
    if (status === "paid") {
      await markOrderPaid(order.id);
    } else if (status !== order.paymentStatus) {
      await db.order.update({ where: { id: order.id }, data: { paymentStatus: status } });
    }

    return NextResponse.json({ ok: true, status, orderNo: order.orderNo });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
