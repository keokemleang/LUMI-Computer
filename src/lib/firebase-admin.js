import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function buildCredential() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) return null;
  // cert() throws synchronously on a malformed key (e.g. broken \n escaping
  // in the hosting provider's env var UI). Left uncaught, that exception
  // happens at module-evaluation time and takes down every route that
  // imports this module — catch it here so a bad key degrades to "admin
  // auth not configured" (adminAuth = null) instead of crashing the app.
  try {
    return cert({
      projectId,
      clientEmail,
      privateKey
    });
  } catch (err) {
    console.error("[firebase-admin] Failed to build credential from env vars:", err.message);
    return null;
  }
}

function buildApp() {
  if (getApps().length) return getApps()[0];
  const credential = buildCredential();
  if (!credential) return null;
  try {
    return initializeApp({ credential });
  } catch (err) {
    console.error("[firebase-admin] Failed to initialize app:", err.message);
    return null;
  }
}

export const firebaseAdminApp = buildApp();

export const adminAuth = (() => {
  if (!firebaseAdminApp) return null;
  try {
    return getAuth(firebaseAdminApp);
  } catch (err) {
    console.error("[firebase-admin] Failed to get Auth instance:", err.message);
    return null;
  }
})();
