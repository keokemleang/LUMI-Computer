"use client";

import * as React from "react";
import { Send, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL: FormState = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const [values, setValues] = React.useState<FormState>(INITIAL);
  const [errors, setErrors] = React.useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  function validate(v: FormState): Partial<FormState> {
    const e: Partial<FormState> = {};
    if (!v.name.trim()) e.name = "Please enter your name.";
    if (!v.email.trim()) {
      e.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!v.subject.trim()) e.subject = "Please add a subject.";
    if (!v.message.trim()) {
      e.message = "Please write a message.";
    } else if (v.message.trim().length < 10) {
      e.message = "Message should be at least 10 characters.";
    }
    return e;
  }

  function update<K extends keyof FormState>(field: K, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate(values);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      toast.error("Please fix the highlighted fields and try again.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "Server error");
      }
      toast.success("Message sent!", {
        description: "We'll get back to you within one business day.",
      });
      setValues(INITIAL);
      setErrors({});
      setSubmitted(true);
    } catch (err) {
      toast.error("Something went wrong.", {
        description:
          err instanceof Error
            ? err.message
            : "Please try again or email us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" error={errors.name}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={!!errors.name}
            disabled={submitting}
          />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={!!errors.email}
            disabled={submitting}
          />
        </Field>
      </div>

      <Field label="Subject" htmlFor="subject" error={errors.subject}>
        <Input
          id="subject"
          name="subject"
          placeholder="What can we help with?"
          value={values.subject}
          onChange={(e) => update("subject", e.target.value)}
          aria-invalid={!!errors.subject}
          disabled={submitting}
        />
      </Field>

      <Field label="Message" htmlFor="message" error={errors.message}>
        <Textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Tell us a bit more…"
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={!!errors.message}
          disabled={submitting}
        />
      </Field>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {submitted
            ? "Thanks — we received your message."
            : "We typically reply within one business day."}
        </p>
        <Button type="submit" disabled={submitting} className="min-w-32">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : submitted ? (
            <>
              <Check className="h-4 w-4" />
              Sent
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && (
        <p className={cn("text-xs text-destructive")} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
