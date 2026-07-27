// firebase-admin/auth transitively depends on jwks-rsa -> jose (ESM-only,
// no CJS export). On a Node.js runtime old enough to lack require(esm)
// support, evaluating that module graph throws ERR_REQUIRE_ESM immediately —
// the real fix is pinning a compatible Node version (see "engines" in
// package.json). This module additionally avoids importing firebase-admin
// at module scope (dynamic import() instead, inside getAdminAuth()) so a
// resolution failure surfaces as a caught, per-request error instead of
// crashing every route that ever imports this file at cold start.

let cachedAuthPromise = null;

async function buildCredential() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) return null;

  const { cert } = await import("firebase-admin/app");
  // cert() throws synchronously on a malformed key (e.g. broken \n escaping
  // in the hosting provider's env var UI) — a bad key should degrade to
  // "admin auth not configured" (null), not crash the caller.
  try {
    return cert({ projectId, clientEmail, privateKey });
  } catch (err) {
    console.error("[firebase-admin] Failed to build credential from env vars:", err.message);
    return null;
  }
}

async function initAdminAuth() {
  try {
    const { initializeApp, getApps } = await import("firebase-admin/app");
    const { getAuth } = await import("firebase-admin/auth");

    const app = getApps().length ? getApps()[0] : await (async () => {
      const credential = await buildCredential();
      if (!credential) return null;
      try {
        return initializeApp({ credential });
      } catch (err) {
        console.error("[firebase-admin] Failed to initialize app:", err.message);
        return null;
      }
    })();
    if (!app) return null;

    return getAuth(app);
  } catch (err) {
    console.error("[firebase-admin] Failed to load firebase-admin:", err.message);
    return null;
  }
}

/** Lazily initializes and caches the Firebase Admin Auth instance. Returns
 * null if credentials are missing/invalid or the module fails to load —
 * callers already treat a null adminAuth as "not configured". */
export function getAdminAuth() {
  if (!cachedAuthPromise) cachedAuthPromise = initAdminAuth();
  return cachedAuthPromise;
}
