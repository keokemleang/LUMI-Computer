import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase-admin";
import { db } from "@/lib/db";

const SESSION_COOKIE = "kl_session";

/**
 * Server-side session lookup: verifies the Firebase session cookie, then
 * loads role/profile from the Prisma User table (role lives in our DB, not
 * in Firebase custom claims, to avoid token-refresh propagation delays).
 * Returns null if there is no valid session.
 */
export async function getSession() {
  const adminAuth = await getAdminAuth();
  if (!adminAuth) return null;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  let decoded;
  try {
    decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return null;
  }

  // Every verified Firebase session must map to a real Prisma User row —
  // callers (e.g. Address, Order) hold foreign keys to it. Google sign-in
  // via the login page (as opposed to register) never calls the explicit
  // sync endpoint, so this upsert is the only guarantee that row exists.
  //
  // This is called on every /admin page load and every requireAdmin()-gated
  // API route, none of which wrap getSession() in their own try/catch — a
  // transient DB error here must not become an uncaught exception (which
  // Vercel serves as an HTML crash page instead of JSON/a redirect). Treat
  // "can't reach the DB" the same as "no session": fail closed, not crashed.
  let profile;
  try {
    profile = await db.user.upsert({
      where: {
        email: decoded.email
      },
      update: {},
      create: {
        email: decoded.email,
        name: decoded.name || null,
        image: decoded.picture || null,
        role: "customer"
      }
    });
  } catch (err) {
    console.error("[session] Failed to load/create user profile:", err);
    return null;
  }

  return {
    user: {
      id: profile.id,
      firebaseUid: decoded.uid,
      email: decoded.email,
      name: profile.name ?? decoded.name ?? null,
      image: profile.image ?? decoded.picture ?? null,
      role: profile.role
    }
  };
}
