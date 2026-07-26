import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseJsonBody } from "@/lib/parse-json";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req) {
  const limited = rateLimit(req, { key: "contact", limit: 5, windowMs: 60_000 });
  if (limited) return limited;

  const { body, errorResponse } = await parseJsonBody(req);
  if (errorResponse) return errorResponse;

  try {
    const name = String(body?.name || "").trim().slice(0, 200);
    const email = String(body?.email || "").trim().slice(0, 200);
    const subject = String(body?.subject || "").trim().slice(0, 200);
    const message = String(body?.message || "").trim().slice(0, 5000);
    if (!name || !email || !subject || !message) {
      return NextResponse.json({
        ok: false,
        error: "All fields are required"
      }, {
        status: 400
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({
        ok: false,
        error: "Invalid email"
      }, {
        status: 400
      });
    }
    await db.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message
      }
    });
    return NextResponse.json({
      ok: true
    });
  } catch {
    return NextResponse.json({
      ok: false,
      error: "Server error"
    }, {
      status: 500
    });
  }
}
