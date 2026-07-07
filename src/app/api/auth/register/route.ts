import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, isValidEmail, validatePassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!name || name.length < 2) {
      return NextResponse.json({ ok: false, error: "Please enter your full name." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    const rules = validatePassword(password);
    if (!rules.valid) {
      const missing: string[] = [];
      if (!rules.length) missing.push("at least 8 characters");
      if (!rules.uppercase) missing.push("an uppercase letter");
      if (!rules.number) missing.push("a number");
      if (!rules.special) missing.push("a special character");
      return NextResponse.json(
        { ok: false, error: `Password must contain ${missing.join(", ")}.` },
        { status: 400 }
      );
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists. Try logging in." },
        { status: 409 }
      );
    }

    const hashed = hashPassword(password);
    await db.user.create({
      data: { name, email, password: hashed, role: "customer" },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("register error", e);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
