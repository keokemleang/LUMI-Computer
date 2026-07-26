import { NextResponse } from "next/server";

// In-memory sliding-window rate limiter, keyed per (bucket, client IP).
// Good enough for a single server instance; if this app ever runs multiple
// instances behind a load balancer, swap the Map for a shared store (Redis/
// Upstash) — each instance would otherwise track its own counters.
const buckets = new Map();

function clientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Call at the top of a route handler. Returns a 429 NextResponse if the
 * caller has exceeded `limit` requests within `windowMs`, otherwise null
 * (meaning: proceed as normal).
 */
export function rateLimit(req, { key, limit, windowMs }) {
  const ip = clientIp(req);
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();

  let entry = buckets.get(bucketKey);
  if (!entry || now - entry.windowStart >= windowMs) {
    entry = { windowStart: now, count: 0 };
    buckets.set(bucketKey, entry);
  }
  entry.count += 1;

  // Opportunistic cleanup so long-running processes don't accumulate stale
  // buckets forever — cheap amortized cost, no background timer needed.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (now - v.windowStart >= windowMs) buckets.delete(k);
    }
  }

  if (entry.count > limit) {
    const retryAfterSec = Math.ceil((entry.windowStart + windowMs - now) / 1000);
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.max(1, retryAfterSec)) } }
    );
  }
  return null;
}
