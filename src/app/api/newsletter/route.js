import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseJsonBody } from "@/lib/parse-json";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req) {
  const limited = rateLimit(req, { key: "newsletter", limit: 5, windowMs: 60_000 });
  if (limited) return limited;

  const { body, errorResponse } = await parseJsonBody(req);
  if (errorResponse) return errorResponse;

  try {
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({
        ok: false,
        error: "Invalid email"
      }, {
        status: 400
      });
    }
    const existing = await db.newsletterSub.findUnique({
      where: {
        email
      }
    });
    if (existing) {
      return NextResponse.json({
        ok: true,
        message: "Already subscribed"
      });
    }
    await db.newsletterSub.create({
      data: {
        email
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
