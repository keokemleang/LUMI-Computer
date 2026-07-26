"use client";

import * as React from "react";
import { onIdTokenChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase-client";

const SessionContext = React.createContext({
  data: null,
  status: "loading"
});

export function SessionProvider({
  children
}) {
  const [state, setState] = React.useState({
    data: null,
    status: "loading"
  });

  React.useEffect(() => {
    const unsub = onIdTokenChanged(auth, async firebaseUser => {
      if (!firebaseUser) {
        setState({
          data: null,
          status: "unauthenticated"
        });
        return;
      }
      try {
        const res = await fetch("/api/auth/me", {
          cache: "no-store"
        });
        const data = await res.json();
        if (data.ok && data.user) {
          setState({
            data: {
              user: data.user
            },
            status: "authenticated"
          });
        } else {
          setState({
            data: null,
            status: "unauthenticated"
          });
        }
      } catch {
        setState({
          data: null,
          status: "unauthenticated"
        });
      }
    });
    return () => unsub();
  }, []);

  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
}

/** Drop-in replacement for next-auth/react's useSession(). */
export function useSession() {
  return React.useContext(SessionContext);
}

/** Drop-in replacement for next-auth/react's signOut(). */
export async function signOut({
  redirect: _redirect
} = {}) {
  await firebaseSignOut(auth);
  await fetch("/api/auth/session", {
    method: "DELETE"
  });
}
