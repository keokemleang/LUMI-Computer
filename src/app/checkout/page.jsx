"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { Loader2, ShieldCheck, ExternalLink, ArrowLeft, QrCode, Banknote, Check } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-store";
import { computeOrderTotals } from "@/lib/pricing";
import { useShippingSettings } from "@/lib/use-shipping-settings";
import { auth } from "@/lib/firebase-client";
import { toast } from "sonner";

function formatPrice(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const POLL_INTERVAL_MS = 3000;
const EXPIRY_MS = 5 * 60 * 1000;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart(s => s.items);
  const subtotal = useCart(s => s.subtotal());
  const clearCart = useCart(s => s.clear);
  const shippingConfig = useShippingSettings();
  const { shipping, tax, total } = computeOrderTotals(subtotal, shippingConfig);

  const [mounted, setMounted] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [city, setCity] = React.useState("");
  const [zip, setZip] = React.useState("");
  const [country, setCountry] = React.useState("Cambodia");
  const [method, setMethod] = React.useState("khqr"); // khqr | cod
  const [submitting, setSubmitting] = React.useState(false);
  const [payment, setPayment] = React.useState(null); // { orderNo, reference, qrCode, paymentUrl, amount }
  const [qrDataUrl, setQrDataUrl] = React.useState(null);
  const [status, setStatus] = React.useState("pending"); // pending | paid | expired | failed
  const [secondsLeft, setSecondsLeft] = React.useState(EXPIRY_MS / 1000);

  React.useEffect(() => {
    setMounted(true);
    const unsub = auth.onAuthStateChanged(u => {
      if (u) {
        setEmail(u.email || "");
        setName(prev => prev || u.displayName || "");
      }
    });
    return () => unsub();
  }, []);

  // Render the KHQR string as a scannable QR image, locally (no third-party rendering service).
  React.useEffect(() => {
    if (!payment?.qrCode) {
      setQrDataUrl(null);
      return;
    }
    QRCode.toDataURL(payment.qrCode, { width: 280, margin: 1 }).then(setQrDataUrl).catch(() => setQrDataUrl(null));
  }, [payment?.qrCode]);

  // Poll for payment status once a KHQR session has been created.
  React.useEffect(() => {
    if (!payment?.reference || status !== "pending") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/khqr/status?reference=${encodeURIComponent(payment.reference)}`);
        const data = await res.json();
        if (data?.ok && data.status !== "pending") {
          setStatus(data.status);
        }
      } catch {
        // transient network error — try again on the next tick
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [payment?.reference, status]);

  // Local countdown, mirrors the provider's 5-minute expiry.
  React.useEffect(() => {
    if (!payment?.reference || status !== "pending") return;
    const start = Date.now();
    const tick = setInterval(() => {
      const remaining = Math.max(0, Math.round((EXPIRY_MS - (Date.now() - start)) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) setStatus(prev => (prev === "pending" ? "expired" : prev));
    }, 1000);
    return () => clearInterval(tick);
  }, [payment?.reference, status]);

  React.useEffect(() => {
    if (status === "paid" && payment?.orderNo) {
      clearCart();
      toast.success("Payment received!");
      router.push(`/checkout/success?ref=${payment.orderNo}`);
    }
  }, [status, payment?.orderNo, clearCart, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !street.trim() || !city.trim() || !country.trim()) {
      toast.error("Please fill in your full shipping address");
      return;
    }
    setSubmitting(true);
    try {
      const endpoint = method === "cod" ? "/api/payments/cod/create" : "/api/payments/khqr/create";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: { name, phone, street, city, zip, country },
          items: items.map(i => ({ slug: i.slug, qty: i.qty }))
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error || "Could not place order");
        return;
      }
      if (method === "cod") {
        clearCart();
        toast.success("Order placed!");
        router.push(`/checkout/success?ref=${data.orderNo}`);
        return;
      }
      setPayment(data);
      setStatus("pending");
      setSecondsLeft(EXPIRY_MS / 1000);
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  if (items.length === 0 && !payment) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add something to your cart before checking out.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-6 md:py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/cart">Cart</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Checkout</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="min-w-0">
          {!payment ? (
            <Card className="gap-0 p-6">
              <h2 className="text-lg font-semibold">Shipping address</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Signed in as <span className="font-medium text-foreground">{email}</span>
              </p>
              <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="checkout-name">Full name</Label>
                  <Input id="checkout-name" value={name} onChange={e => setName(e.target.value)} placeholder="Sam Customer" autoComplete="name" className="mt-1.5" required />
                </div>
                <div>
                  <Label htmlFor="checkout-phone">Phone</Label>
                  <Input id="checkout-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+855 23 000 000" autoComplete="tel" className="mt-1.5" required />
                </div>
                <div>
                  <Label htmlFor="checkout-street">Street address</Label>
                  <Input id="checkout-street" value={street} onChange={e => setStreet(e.target.value)} placeholder="123 Maker Lane" autoComplete="address-line1" className="mt-1.5" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="checkout-city">City</Label>
                    <Input id="checkout-city" value={city} onChange={e => setCity(e.target.value)} placeholder="Phnom Penh" autoComplete="address-level2" className="mt-1.5" required />
                  </div>
                  <div>
                    <Label htmlFor="checkout-zip">ZIP / Postal</Label>
                    <Input id="checkout-zip" value={zip} onChange={e => setZip(e.target.value)} placeholder="120101" autoComplete="postal-code" className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="checkout-country">Country</Label>
                  <Input id="checkout-country" value={country} onChange={e => setCountry(e.target.value)} placeholder="Cambodia" autoComplete="country-name" className="mt-1.5" required />
                </div>

                <div>
                  <Label>Payment method</Label>
                  <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setMethod("khqr")}
                      aria-pressed={method === "khqr"}
                      className={`relative flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${method === "khqr" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"}`}
                    >
                      <QrCode className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-medium">KHQR (Bakong)</p>
                        <p className="text-xs text-muted-foreground">Scan &amp; pay instantly with any Cambodian bank app</p>
                      </div>
                      {method === "khqr" && <Check className="absolute right-3 top-3 h-4 w-4 text-primary" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod("cod")}
                      aria-pressed={method === "cod"}
                      className={`relative flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${method === "cod" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"}`}
                    >
                      <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground">Pay in cash when your order arrives</p>
                      </div>
                      {method === "cod" && <Check className="absolute right-3 top-3 h-4 w-4 text-primary" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {method === "cod" ? `Place order — pay ${formatPrice(total)} on delivery` : "Generate KHQR payment"}
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="gap-0 p-6 text-center">
              {status === "pending" && (
                <>
                  <h2 className="text-lg font-semibold">Scan to pay with KHQR</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Open any Bakong-connected bank app and scan this code, or tap the button below.
                  </p>
                  {qrDataUrl ? (
                    <Image src={qrDataUrl} alt="KHQR payment code" width={280} height={280} className="mx-auto mt-6 rounded-lg border border-border" unoptimized />
                  ) : (
                    <div className="mx-auto mt-6 flex h-[280px] w-[280px] items-center justify-center rounded-lg border border-border">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  <p className="mt-4 text-2xl font-bold">{formatPrice(payment.amount)}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">Ref: {payment.reference}</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Expires in{" "}
                    <span className="font-medium tabular-nums text-foreground">
                      {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
                    </span>
                  </p>
                  {payment.paymentUrl && (
                    <Button asChild variant="outline" className="mt-5">
                      <a href={payment.paymentUrl} target="_blank" rel="noopener noreferrer">
                        Open payment page <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Waiting for payment confirmation…
                  </div>
                </>
              )}
              {status === "expired" && (
                <>
                  <h2 className="text-lg font-semibold">Payment session expired</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    KHQR sessions expire after 5 minutes. Generate a new one to try again.
                  </p>
                  <Button className="mt-6" onClick={() => setPayment(null)}>
                    <ArrowLeft className="h-4 w-4" /> Start over
                  </Button>
                </>
              )}
              {status === "failed" && (
                <>
                  <h2 className="text-lg font-semibold">Payment failed</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Something went wrong creating this payment.</p>
                  <Button className="mt-6" onClick={() => setPayment(null)}>
                    <ArrowLeft className="h-4 w-4" /> Try again
                  </Button>
                </>
              )}
            </Card>
          )}
        </section>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card className="gap-0 p-6">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {items.map(item => (
                <li key={item.slug} className="flex items-center gap-3 text-sm">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-muted-foreground">Qty {item.qty}</p>
                  </div>
                  <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <Separator className="my-5" />
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-medium">{shipping === 0 ? <span className="text-success">Free</span> : formatPrice(shipping)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Tax</dt>
                <dd className="font-medium">{formatPrice(tax)}</dd>
              </div>
            </dl>
            <Separator className="my-5" />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">{formatPrice(total)}</span>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {method === "cod" ? "Pay in cash when your order is delivered" : "Paid securely via KHQR (Bakong)"}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
