import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { markOrderPaid } from "@/lib/orders";
import { checkKhqrTransaction } from "@/lib/khqr";
import { parseJsonBody } from "@/lib/parse-json";
import { rateLimit } from "@/lib/rate-limit";

/**
 * CamRapidPay does not publish an HMAC/signature header in the docs available
 * to this codebase, so the webhook body's `status` field can never be trusted
 * on its own — anyone can POST {"reference": "...", "status": "success"}.
 * Instead of trusting the payload, this handler uses it only as a *trigger*
 * to re-check the transaction directly against CamRapidPay's own
 * check-transaction API (the same call the status-poll route makes) using
 * our server-held API key. Only that server-to-server response is ever
 * trusted to mark an order paid. This closes the forgery hole regardless of
 * signature scheme. If CamRapidPay's real signing scheme is documented later
 * (header name + algorithm), add it as an additional check above this one.
 */
export async function POST(req) {
  const limited = rateLimit(req, { key: "webhook:khqr", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  const { body, errorResponse } = await parseJsonBody(req);
  if (errorResponse) return errorResponse;

  const reference = String(body?.reference || "").trim();
  if (!reference) {
    return NextResponse.json({ received: false, error: "Missing reference" }, { status: 401 });
  }

  try {
    const order = await db.order.findUnique({ where: { paymentRef: reference } });
    if (!order) {
      // Acknowledge anyway so the provider doesn't keep retrying for an order we don't have.
      return NextResponse.json({ received: true });
    }

    // Already settled — idempotent no-op, also makes replayed webhooks harmless.
    if (order.paymentStatus !== "pending") {
      return NextResponse.json({ received: true });
    }

    // Never trust body.status — ask CamRapidPay directly what the real status is.
    const remote = await checkKhqrTransaction(reference);
    if (remote?.status === "Success") {
      await markOrderPaid(order.id);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }
}
