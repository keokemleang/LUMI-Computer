"use client";

/** Exchanges a signed-in Firebase user's ID token for our httpOnly session cookie. */
export async function establishSession(firebaseUser) {
  const idToken = await firebaseUser.getIdToken();
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      idToken
    })
  });
  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Could not establish session");
  }
}

/** Maps Firebase Auth error codes to friendly messages. */
export function friendlyAuthError(err) {
  const code = err?.code || "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password. Please try again.";
    case "auth/email-already-in-use":
      return "An account with that email already exists.";
    case "auth/weak-password":
      return "Password is too weak.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled.";
    default:
      return err?.message || "Something went wrong. Please try again.";
  }
}
