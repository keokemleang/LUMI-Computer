import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { parseJsonBody } from "@/lib/parse-json";

const FULFILLMENT_STATUSES = ["processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "expired", "failed"];

export async function PATCH(req, {
  params
}) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { body, errorResponse } = await parseJsonBody(req);
  if (errorResponse) return errorResponse;
  const data = {};

  if (body.status !== undefined) {
    if (!FULFILLMENT_STATUSES.includes(body.status)) {
      return NextResponse.json({
        ok: false,
        error: "Invalid status"
      }, {
        status: 400
      });
    }
    data.status = body.status;
  }

  if (body.paymentStatus !== undefined) {
    if (!PAYMENT_STATUSES.includes(body.paymentStatus)) {
      return NextResponse.json({
        ok: false,
        error: "Invalid payment status"
      }, {
        status: 400
      });
    }
    data.paymentStatus = body.paymentStatus;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({
      ok: false,
      error: "Nothing to update"
    }, {
      status: 400
    });
  }

  try {
    const order = await db.order.update({
      where: {
        id
      },
      data
    });
    return NextResponse.json({
      ok: true,
      order
    });
  } catch (err) {
    if (err?.code === "P2025") {
      return NextResponse.json({
        ok: false,
        error: "Order not found"
      }, {
        status: 404
      });
    }
    return NextResponse.json({
      ok: false,
      error: "Failed to update order"
    }, {
      status: 500
    });
  }
}
