// Isomorphic password/email helpers — safe to import in client components.
// (Node-only scrypt hashing lives in src/lib/password.ts)

const SPECIAL_RE = /[^A-Za-z0-9]/;
const UPPERCASE_RE = /[A-Z]/;
const NUMBER_RE = /[0-9]/;

/** Validate a password against LUMI Computer rules. */
export function validatePassword(pw) {
  const length = pw.length >= 8;
  const uppercase = UPPERCASE_RE.test(pw);
  const number = NUMBER_RE.test(pw);
  const special = SPECIAL_RE.test(pw);
  return {
    length,
    uppercase,
    number,
    special,
    valid: length && uppercase && number && special
  };
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(email) {
  return EMAIL_RE.test(email);
}
export function initialsFromName(name, email) {
  const base = (name || email || "?").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}
