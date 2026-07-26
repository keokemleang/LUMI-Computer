import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function buildCredential() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) return null;
  return cert({
    projectId,
    clientEmail,
    privateKey
  });
}

const credential = buildCredential();

export const firebaseAdminApp = getApps().length ? getApps()[0] : credential ? initializeApp({
  credential
}) : null;

export const adminAuth = firebaseAdminApp ? getAuth(firebaseAdminApp) : null;
