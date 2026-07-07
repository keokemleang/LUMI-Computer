// Isomorphic password/email helpers — safe to import in client components.
// (Node-only scrypt hashing lives in src/lib/password.ts)

export interface PasswordRules {
  length: boolean; // min 8 chars
  uppercase: boolean; // at least 1 capital letter
  number: boolean; // at least 1 digit
  special: boolean; // at least 1 special character
}

export interface PasswordValidation extends PasswordRules {
  valid: boolean;
}

const SPECIAL_RE = /[^A-Za-z0-9]/;
const UPPERCASE_RE = /[A-Z]/;
const NUMBER_RE = /[0-9]/;

/** Validate a password against KBSCircuit rules. */
export function validatePassword(pw: string): PasswordValidation {
  const length = pw.length >= 8;
  const uppercase = UPPERCASE_RE.test(pw);
  const number = NUMBER_RE.test(pw);
  const special = SPECIAL_RE.test(pw);
  return { length, uppercase, number, special, valid: length && uppercase && number && special };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

export function initialsFromName(name?: string | null, email?: string | null): string {
  const base = (name || email || "?").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}
