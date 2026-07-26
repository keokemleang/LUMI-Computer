import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImageBuffer } from "@/lib/cloudinary";
import { detectImageType } from "@/lib/file-signature";
import { rateLimit } from "@/lib/rate-limit";

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req) {
  const { error } = await requireAdmin();
  if (error) return error;

  const limited = rateLimit(req, { key: "admin:upload", limit: 20, windowMs: 60_000 });
  if (limited) return limited;

  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({
      ok: false,
      error: "No file provided"
    }, {
      status: 400
    });
  }
  if (!file.type?.startsWith("image/")) {
    return NextResponse.json({
      ok: false,
      error: "File must be an image"
    }, {
      status: 400
    });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({
      ok: false,
      error: "Image must be under 8MB"
    }, {
      status: 413
    });
  }

  const name = typeof file.name === "string" ? file.name.toLowerCase() : "";
  const declaredExt = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";

  const buffer = Buffer.from(await file.arrayBuffer());

  // The declared MIME type and file extension are just labels the client
  // chose — an attacker can rename anything to "photo.png" with
  // Content-Type: image/png. Only the actual byte signature is trustworthy.
  const detected = detectImageType(buffer);
  if (!detected) {
    return NextResponse.json({
      ok: false,
      error: "File does not look like a valid image"
    }, {
      status: 400
    });
  }
  if (detected.type !== file.type) {
    return NextResponse.json({
      ok: false,
      error: "File content does not match its declared type"
    }, {
      status: 400
    });
  }
  if (declaredExt && !detected.ext.includes(declaredExt)) {
    return NextResponse.json({
      ok: false,
      error: "File extension does not match its content"
    }, {
      status: 400
    });
  }

  try {
    const url = await uploadImageBuffer(buffer);
    return NextResponse.json({
      ok: true,
      url
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: err?.message || "Upload failed"
    }, {
      status: 500
    });
  }
}
