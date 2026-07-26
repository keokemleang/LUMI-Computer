import { NextResponse } from "next/server";

// Default cap for JSON API bodies. Generous enough for any legitimate form
// on this site (addresses, product edits with embedded spec arrays, contact
// messages) while still ruling out multi-megabyte abuse payloads.
const DEFAULT_MAX_BYTES = 256 * 1024; // 256KB

/**
 * Safely parses a request body as JSON, enforcing a size cap that does not
 * rely solely on a client-supplied Content-Length header (which can be
 * absent or wrong) — the raw body is read and measured directly.
 *
 * Returns { body } on success, or { errorResponse } — a 413 NextResponse
 * for an oversized body, or a 400 for missing/malformed JSON — that callers
 * should `return` directly instead of letting req.json() throw and fall
 * through to a generic 500.
 */
export async function parseJsonBody(req, { maxBytes = DEFAULT_MAX_BYTES } = {}) {
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > maxBytes) {
    return {
      errorResponse: NextResponse.json(
        { ok: false, error: "Payload too large" },
        { status: 413 }
      )
    };
  }

  let raw;
  try {
    raw = await req.text();
  } catch {
    return {
      errorResponse: NextResponse.json(
        { ok: false, error: "Invalid JSON body" },
        { status: 400 }
      )
    };
  }

  if (Buffer.byteLength(raw, "utf8") > maxBytes) {
    return {
      errorResponse: NextResponse.json(
        { ok: false, error: "Payload too large" },
        { status: 413 }
      )
    };
  }

  try {
    return { body: raw ? JSON.parse(raw) : {} };
  } catch {
    return {
      errorResponse: NextResponse.json(
        { ok: false, error: "Invalid JSON body" },
        { status: 400 }
      )
    };
  }
}
