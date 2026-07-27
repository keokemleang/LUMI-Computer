import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth, getAdminAuthError } from "@/lib/firebase-admin";
import { parseJsonBody } from "@/lib/parse-json";
import { rateLimit } from "@/lib/rate-limit";

const SESSION_COOKIE = "kl_session";
const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export async function POST(req) {
  const limited = rateLimit(req, { key: "auth:login", limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  const adminAuth = await getAdminAuth();
  if (!adminAuth) {
    return NextResponse.json({
      ok: false,
      error: getAdminAuthError() || "Firebase Admin is not configured on the server"
    }, {
      status: 500
    });
  }

  const { body, errorResponse } = await parseJsonBody(req);
  if (errorResponse) return errorResponse;
  const idToken = body?.idToken;
  if (!idToken) {
    return NextResponse.json({
      ok: false,
      error: "Missing ID token"
    }, {
      status: 400
    });
  }

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS
    });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, sessionCookie, {
      maxAge: SESSION_MAX_AGE_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax"
    });
    return NextResponse.json({
      ok: true
    });
  } catch {
    return NextResponse.json({
      ok: false,
      error: "Could not create session"
    }, {
      status: 401
    });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({
    ok: true
  });
}
