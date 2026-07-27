// firebase-admin/auth transitively depends on jwks-rsa -> jose (ESM-only,
// no CJS export). On a Node.js runtime old enough to lack require(esm)
// support, evaluating that module graph throws ERR_REQUIRE_ESM immediately —
// the real fix is pinning a compatible Node version (see "engines" in
// package.json). This module additionally avoids importing firebase-admin
// at module scope (dynamic import() instead, inside getAdminAuth()) so a
// resolution failure surfaces as a caught, per-request error instead of
// crashing every route that ever imports this file at cold start.

let cachedAuthPromise = null;

// Set to the specific reason the last initAdminAuth() attempt returned null
// (e.g. "Missing FIREBASE_PRIVATE_KEY", "Failed to parse private key: ...").
// Never contains secret values — only which variable/step failed and why.
// Read via getAdminAuthError() so callers can surface a real diagnosis
// instead of a generic "not configured" message.
let lastInitError = null;

function setError(reason, err) {
  lastInitError = err ? `${reason}: ${err.message}` : reason;
  console.error(`[firebase-admin] ${lastInitError}`);
}

/**
 * Normalizes a FIREBASE_PRIVATE_KEY env var value into a real PEM string.
 * Handles every shape it's realistically pasted as:
 *  - actual newlines already in the value (multi-line env var) — untouched
 *  - a literal `\n` two-character escape (the common single-line form)
 *  - a literal `\\n` three-character double-escape (extra layer of
 *    JSON/shell escaping some hosting UIs introduce)
 *  - the whole value wrapped in a single layer of quotes
 */
function normalizePrivateKey(raw) {
  if (!raw) return raw;
  let key = raw.trim();
  if (key.length >= 2) {
    const first = key[0];
    const last = key[key.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      key = key.slice(1, -1);
    }
  }
  key = key.replace(/\\\\n/g, "\\n"); // "\\n" (double-escaped) -> "\n"
  key = key.replace(/\\n/g, "\n");    // "\n" (literal escape)  -> real newline
  return key;
}

async function buildCredential() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId) {
    setError("Missing FIREBASE_PROJECT_ID");
    return null;
  }
  if (!clientEmail) {
    setError("Missing FIREBASE_CLIENT_EMAIL");
    return null;
  }
  if (!rawPrivateKey) {
    setError("Missing FIREBASE_PRIVATE_KEY");
    return null;
  }

  const privateKey = normalizePrivateKey(rawPrivateKey);
  if (!privateKey.includes("BEGIN PRIVATE KEY")) {
    setError("FIREBASE_PRIVATE_KEY is set but does not contain a 'BEGIN PRIVATE KEY' PEM marker after normalization — value is likely truncated or malformed");
    return null;
  }

  const { cert } = await import("firebase-admin/app");
  // cert() throws synchronously on a malformed key — a bad key should
  // degrade to "admin auth not configured" (null), not crash the caller.
  try {
    const credential = cert({ projectId, clientEmail, privateKey });
    lastInitError = null;
    return credential;
  } catch (err) {
    setError("Failed to parse FIREBASE_PRIVATE_KEY", err);
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
        setError("Failed to initialize Firebase Admin app", err);
        return null;
      }
    })();
    if (!app) return null;

    try {
      const auth = getAuth(app);
      lastInitError = null;
      return auth;
    } catch (err) {
      setError("Failed to get Firebase Auth instance", err);
      return null;
    }
  } catch (err) {
    setError("Failed to load firebase-admin module", err);
    return null;
  }
}

/** Lazily initializes and caches the Firebase Admin Auth instance. Returns
 * null if credentials are missing/invalid or the module fails to load —
 * check getAdminAuthError() for the specific reason. */
export function getAdminAuth() {
  if (!cachedAuthPromise) cachedAuthPromise = initAdminAuth();
  return cachedAuthPromise;
}

/** Returns the specific reason the last getAdminAuth() resolved to null, or
 * null if it hasn't been called yet / last succeeded. Never contains secret
 * values. Must be read *after* awaiting getAdminAuth(). */
export function getAdminAuthError() {
  return lastInitError;
}
