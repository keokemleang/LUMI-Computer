import { NextResponse } from "next/server";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Server-to-server callers (the KHQR webhook) never send a browser Origin
// header at all, so they already pass through the "no Origin/Referer"
// allowance below — kept here as an explicit, self-documenting exemption
// too, in case the provider ever starts sending one.
const EXEMPT_PATHS = ["/api/webhooks/khqr"];

/**
 * Defense-in-depth CSRF check for state-changing API requests. The primary
 * CSRF defense is the session cookie's `sameSite: "lax"` + `httpOnly` flags
 * (set in api/auth/session/route.js), which already stops the classic
 * cross-site form-post attack. This adds a second, independent layer: when
 * a browser does send an Origin/Referer header (which it does for same-site
 * POSTs too, not just cross-site ones), it must match this app's own
 * origin, or the request is rejected outright.
 */
export function proxy(req) {
  const { method, nextUrl } = req;
  if (!UNSAFE_METHODS.has(method)) return NextResponse.next();
  if (EXEMPT_PATHS.some(path => nextUrl.pathname.startsWith(path))) return NextResponse.next();

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  let sourceOrigin = origin;
  if (!sourceOrigin && referer) {
    try {
      sourceOrigin = new URL(referer).origin;
    } catch {
      sourceOrigin = null;
    }
  }

  // No Origin/Referer at all — typical of non-browser clients (curl, server-
  // to-server calls, some older browsers). The sameSite cookie is still the
  // backstop here; this middleware only actively blocks a *mismatched* one.
  if (!sourceOrigin) return NextResponse.next();

  // `nextUrl.origin` reflects the server's own bind address/hostname, not
  // the Host the browser actually targeted — in the standalone production
  // server this is "http://0.0.0.0:3000" regardless of the real domain,
  // which would reject every legitimate request. Build the expected origin
  // from the Host header instead (X-Forwarded-Host/-Proto first, so this
  // also works correctly behind the Caddy reverse proxy in front of prod).
  const forwardedHost = req.headers.get("x-forwarded-host");
  const host = forwardedHost || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || nextUrl.protocol.replace(":", "");
  const expectedOrigin = host ? `${proto}://${host}` : nextUrl.origin;

  if (sourceOrigin !== expectedOrigin) {
    return NextResponse.json(
      { ok: false, error: "Cross-origin request blocked" },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: "/api/:path*"
};
