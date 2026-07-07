import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Re-export isomorphic helpers so server code can import from one place.
export {
  validatePassword,
  isValidEmail,
  initialsFromName,
  type PasswordRules,
  type PasswordValidation,
} from "./password-rules";

/**
 * Hash a password using Node's scrypt (no external deps).
 * Returns "salt:hash" (both hex). SERVER-ONLY.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/** Verify a plaintext password against a stored "salt:hash" string. SERVER-ONLY. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  try {
    const hashBuf = Buffer.from(hash, "hex");
    const testBuf = scryptSync(password, salt, 64);
    if (testBuf.length !== hashBuf.length) return false;
    return timingSafeEqual(testBuf, hashBuf);
  } catch {
    return false;
  }
}
