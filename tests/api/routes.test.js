// Integration tests against a running dev/prod server.
// Requires `bun run dev` (or `bun run start`) in another terminal first —
// these hit real HTTP endpoints rather than mocking Next.js internals.
// Skips automatically if no server is reachable on BASE_URL.
import { describe, test, expect, beforeAll } from "bun:test";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let serverUp = false;
beforeAll(async () => {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(2000) });
    serverUp = res.ok;
  } catch {
    serverUp = false;
  }
  if (!serverUp) {
    console.warn(`\n[tests/api] No server reachable at ${BASE_URL} — skipping API integration tests. Run "bun run dev" first.\n`);
  }
});

async function post(path, body) {
  return fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  });
}

describe("public pages", () => {
  test("home page returns 200", async () => {
    if (!serverUp) return;
    const res = await fetch(`${BASE_URL}/`);
    expect(res.status).toBe(200);
  });

  test("unknown product slug returns 404", async () => {
    if (!serverUp) return;
    const res = await fetch(`${BASE_URL}/products/definitely-not-a-real-slug`);
    expect(res.status).toBe(404);
  });

  test("unknown route returns 404", async () => {
    if (!serverUp) return;
    const res = await fetch(`${BASE_URL}/this-route-does-not-exist`);
    expect(res.status).toBe(404);
  });
});

describe("protected pages redirect when unauthenticated", () => {
  for (const path of ["/account", "/admin", "/checkout"]) {
    test(`${path} redirects to login`, async () => {
      if (!serverUp) return;
      const res = await fetch(`${BASE_URL}${path}`, { redirect: "manual" });
      expect([307, 302]).toContain(res.status);
    });
  }
});

describe("malformed JSON bodies return 400/401/403, never an unhandled 500", () => {
  const routes = [
    "/api/auth/register",
    "/api/auth/session",
    "/api/admin/categories",
    "/api/admin/products",
    "/api/admin/settings",
    "/api/account/addresses",
    "/api/payments/khqr/create",
    "/api/webhooks/khqr"
    // /api/contact and /api/newsletter are exercised in the rate-limiting
    // block below instead, to avoid burning their 5-req/min budget twice.
  ];
  for (const route of routes) {
    test(`POST ${route} with invalid JSON -> never 500`, async () => {
      if (!serverUp) return;
      const res = await post(route, "not json");
      // Admin/account/payment routes may 401 first (auth checked before body
      // parsing); the CSRF layer may 403 first if Origin is present and
      // mismatched. The only unacceptable outcome is an unhandled 500.
      expect(res.status).not.toBe(500);
    });
  }
});

describe("request size limits", () => {
  test("a 1MB JSON body is rejected with 413, not silently accepted", async () => {
    if (!serverUp) return;
    const oversized = JSON.stringify({
      name: "x",
      email: "a@a.com",
      subject: "s",
      message: "a".repeat(1024 * 1024)
    });
    const res = await post("/api/contact", oversized);
    expect(res.status).toBe(413);
  });
});

describe("input validation", () => {
  test("contact form rejects an empty body with 400", async () => {
    if (!serverUp) return;
    const res = await post("/api/contact", JSON.stringify({}));
    expect(res.status).toBe(400);
  });

  test("newsletter rejects an invalid email with 400", async () => {
    if (!serverUp) return;
    const res = await post("/api/newsletter", JSON.stringify({ email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  test("search below the 2-char minimum returns an empty result set, not an error", async () => {
    if (!serverUp) return;
    const res = await fetch(`${BASE_URL}/api/search?q=a`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.results).toEqual([]);
  });

  test("search tolerates SQL-injection-shaped input without erroring", async () => {
    if (!serverUp) return;
    const res = await fetch(`${BASE_URL}/api/search?${new URLSearchParams({ q: "' OR '1'='1" })}`);
    expect(res.status).toBe(200);
  });
});

describe("authorization", () => {
  test("admin write routes reject unauthenticated requests with 401", async () => {
    if (!serverUp) return;
    const res = await post("/api/admin/categories", JSON.stringify({ name: "Hacked" }));
    expect(res.status).toBe(401);
  });

  test("account routes reject unauthenticated requests with 401", async () => {
    if (!serverUp) return;
    const res = await fetch(`${BASE_URL}/api/account/addresses`);
    expect(res.status).toBe(401);
  });

  test("a forged/garbage session cookie is rejected, not treated as valid", async () => {
    if (!serverUp) return;
    const res = await fetch(`${BASE_URL}/api/account/addresses`, {
      headers: { Cookie: "kl_session=forged_garbage_token" }
    });
    expect(res.status).toBe(401);
  });

  test("checkout requires authentication regardless of payload", async () => {
    if (!serverUp) return;
    const res = await post(
      "/api/payments/khqr/create",
      JSON.stringify({ items: [{ slug: "x", qty: 999999 }] })
    );
    expect(res.status).toBe(401);
  });
});

describe("HTTP method enforcement", () => {
  test("DELETE on a GET-only route returns 405", async () => {
    if (!serverUp) return;
    const res = await fetch(`${BASE_URL}/api/search`, { method: "DELETE" });
    expect(res.status).toBe(405);
  });
});

describe("payment status endpoint requires authentication", () => {
  test("no session -> 401, never leaks whether the reference exists", async () => {
    if (!serverUp) return;
    const res = await fetch(`${BASE_URL}/api/payments/khqr/status?reference=KLC-2026-ANYTHING`);
    expect(res.status).toBe(401);
  });

  test("forged session cookie -> 401", async () => {
    if (!serverUp) return;
    const res = await fetch(`${BASE_URL}/api/payments/khqr/status?reference=KLC-2026-ANYTHING`, {
      headers: { Cookie: "kl_session=forged_garbage_token" }
    });
    expect(res.status).toBe(401);
  });
});

describe("webhook does not trust the request body alone", () => {
  test("missing reference -> 401, not silently accepted", async () => {
    if (!serverUp) return;
    const res = await post("/api/webhooks/khqr", JSON.stringify({ status: "success" }));
    expect(res.status).toBe(401);
  });

  test("forged success for an unknown reference is acknowledged but cannot mark anything paid", async () => {
    if (!serverUp) return;
    // No order exists for this reference, so this proves the endpoint can't
    // be used to fabricate a paid order out of thin air — it 200s (so the
    // provider stops retrying) without creating or mutating any record.
    const res = await post(
      "/api/webhooks/khqr",
      JSON.stringify({ reference: "KLC-FORGED-DOES-NOT-EXIST", status: "success" })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.received).toBe(true);
  });
});

describe("CSRF defense-in-depth: Origin must match when present", () => {
  test("a POST with a mismatched Origin header is blocked with 403", async () => {
    if (!serverUp) return;
    const res = await fetch(`${BASE_URL}/api/admin/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://evil.example.com" },
      body: JSON.stringify({ name: "CSRF Test" })
    });
    expect(res.status).toBe(403);
  });

  test("a POST with a matching same-origin Origin header is not blocked by CSRF layer (falls through to 401)", async () => {
    if (!serverUp) return;
    const res = await fetch(`${BASE_URL}/api/admin/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: BASE_URL },
      body: JSON.stringify({ name: "CSRF Test" })
    });
    // Not authenticated, so it should reach the auth check (401) rather
    // than being blocked at the CSRF layer (403).
    expect(res.status).toBe(401);
  });
});

describe("rate limiting", () => {
  test("newsletter signup returns 429 once its per-minute budget is exceeded", async () => {
    if (!serverUp) return;
    const attempts = Array.from({ length: 8 }, (_, i) =>
      post("/api/newsletter", JSON.stringify({ email: `ratelimit-test-${i}@example.com` }))
    );
    const results = await Promise.all(attempts);
    const statuses = results.map(r => r.status);
    expect(statuses).toContain(429);
  });
});
