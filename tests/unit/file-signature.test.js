import { describe, test, expect } from "bun:test";
import { detectImageType } from "@/lib/file-signature";

describe("detectImageType", () => {
  test("detects a real PNG from its magic bytes", () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
    expect(detectImageType(png)?.type).toBe("image/png");
  });

  test("detects a real JPEG from its magic bytes", () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0]);
    expect(detectImageType(jpeg)?.type).toBe("image/jpeg");
  });

  test("rejects a renamed executable (MZ header) labeled as an image", () => {
    // The Windows PE/EXE magic number — this is the exact attack the
    // upload-validation fix defends against: a .exe renamed to photo.png
    // with Content-Type: image/png.
    const exe = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);
    expect(detectImageType(exe)).toBeNull();
  });

  test("rejects a plain text/script file", () => {
    const script = Buffer.from("<?php system($_GET['c']); ?>", "utf8");
    expect(detectImageType(script)).toBeNull();
  });

  test("rejects an empty/too-short buffer without throwing", () => {
    expect(detectImageType(Buffer.from([]))).toBeNull();
    expect(detectImageType(Buffer.from([0x89]))).toBeNull();
  });
});
