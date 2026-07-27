import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminAuth } from "@/lib/firebase-admin";
import { parseJsonBody } from "@/lib/parse-json";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Called after the client has already created the Firebase Auth account.
 * Verifies the ID token server-side, then creates the matching profile row
 * in our own User table (role, name — Firebase owns the credentials).
 */
export async function POST(req) {
  const limited = rateLimit(req, { key: "auth:register", limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  const adminAuth = await getAdminAuth();
  if (!adminAuth) {
    return NextResponse.json({
      ok: false,
      error: "Firebase Admin is not configured on the server"
    }, {
      status: 500
    });
  }

  const { body, errorResponse } = await parseJsonBody(req);
  if (errorResponse) return errorResponse;

  try {
    const idToken = body?.idToken;
    if (!idToken) {
      return NextResponse.json({
        ok: false,
        error: "Missing ID token"
      }, {
        status: 400
      });
    }

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json({
        ok: false,
        error: "Invalid or expired sign-in token"
      }, {
        status: 401
      });
    }
    const email = decoded.email;
    const name = body?.name?.trim() || decoded.name || null;

    if (!email) {
      return NextResponse.json({
        ok: false,
        error: "Firebase account has no email"
      }, {
        status: 400
      });
    }

    const user = await db.user.upsert({
      where: {
        email
      },
      update: {
        name: name ?? undefined,
        image: decoded.picture ?? undefined
      },
      create: {
        email,
        name,
        image: decoded.picture || null,
        role: "customer"
      }
    });

    return NextResponse.json({
      ok: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (e) {
    console.error("register sync error", e);
    return NextResponse.json({
      ok: false,
      error: "Something went wrong. Please try again."
    }, {
      status: 500
    });
  }
}
