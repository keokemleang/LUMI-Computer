"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { friendlyAuthError } from "@/lib/auth-client";
import { Eye, EyeOff, Loader2, Lock, AlertCircle, Check, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validatePassword } from "@/lib/password-rules";

export default function ResetPasswordPage() {
  return <React.Suspense fallback={<Card className="p-6 shadow-sm sm:p-8" />}>
      <ResetPasswordForm />
    </React.Suspense>;
}
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode") || "";

  const [checking, setChecking] = React.useState(true);
  const [validCode, setValidCode] = React.useState(false);
  const [accountEmail, setAccountEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [done, setDone] = React.useState(false);

  const rules = React.useMemo(() => validatePassword(password), [password]);
  const confirmMatch = confirm.length > 0 && password === confirm;

  React.useEffect(() => {
    if (!oobCode) {
      setChecking(false);
      return;
    }
    verifyPasswordResetCode(auth, oobCode).then(email => {
      setAccountEmail(email);
      setValidCode(true);
    }).catch(() => {
      setValidCode(false);
    }).finally(() => {
      setChecking(false);
    });
  }, [oobCode]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!rules.valid) {
      setError("Please make sure your password meets all the requirements below.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return <Card className="p-6 shadow-sm sm:p-8">
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>;
  }

  if (!oobCode || !validCode) {
    return <Card className="p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-destructive/15 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Invalid reset link</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This link is invalid or has expired. Request a new one below.
          </p>
          <Button asChild className="mt-6">
            <Link href="/forgot-password">Request new link</Link>
          </Button>
        </div>
      </Card>;
  }

  if (done) {
    return <Card className="p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Password reset</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password has been updated. Redirecting you to sign in...
          </p>
        </div>
      </Card>;
  }

  return <Card className="p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Set a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a strong password for <span className="font-medium text-foreground">{accountEmail}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>}

        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="password" type={showPw ? "text" : "password"} autoComplete="new-password" placeholder="Create a strong password" className="pl-9 pr-9" value={password} onChange={e => setPassword(e.target.value)} required autoFocus />
            <button type="button" onClick={() => setShowPw(s => !s)} aria-label={showPw ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <ul className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
            <Rule ok={rules.length} label="8+ characters" />
            <Rule ok={rules.uppercase} label="Uppercase letter" />
            <Rule ok={rules.number} label="Number" />
            <Rule ok={rules.special} label="Special character" />
          </ul>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm new password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="confirm" type={showPw ? "text" : "password"} autoComplete="new-password" placeholder="Re-enter your password" className="pl-9 pr-9" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            {confirm.length > 0 && <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {confirmMatch ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-destructive" />}
              </span>}
          </div>
        </div>

        <Button type="submit" className="h-11 w-full sm:h-10" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </Card>;
}
function Rule({
  ok,
  label
}) {
  return <li className={`flex items-center gap-1.5 transition-colors ${ok ? "text-success" : "text-muted-foreground"}`}>
      <span className={`grid h-3.5 w-3.5 place-items-center rounded-full ${ok ? "bg-success/15" : "bg-muted"}`}>
        {ok ? <Check className="h-2.5 w-2.5" /> : <span className="h-1 w-1 rounded-full bg-muted-foreground" />}
      </span>
      {label}
    </li>;
}
