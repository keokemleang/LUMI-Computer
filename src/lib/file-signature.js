// Detects an image's real format from its leading bytes (the "magic
// number"), independent of whatever Content-Type/extension the client
// claims. A renamed executable or script will not match any signature here
// even if it's labeled "image/png" and named "photo.png".
const SIGNATURES = [
  { type: "image/jpeg", ext: [".jpg", ".jpeg"], match: b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    type: "image/png",
    ext: [".png"],
    match: b => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a
  },
  { type: "image/gif", ext: [".gif"], match: b => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 },
  {
    type: "image/webp",
    ext: [".webp"],
    match: b => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  },
  {
    type: "image/avif",
    ext: [".avif"],
    match: b => b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70 && b.slice(8, 12).toString("ascii").startsWith("avi")
  }
];

/** Returns the detected { type, ext } for a buffer, or null if it matches no known image signature. */
export function detectImageType(buffer) {
  for (const sig of SIGNATURES) {
    try {
      if (sig.match(buffer)) return { type: sig.type, ext: sig.ext };
    } catch {
      // buffer too short for this signature's byte offsets — not a match
    }
  }
  return null;
}
