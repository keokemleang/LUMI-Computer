"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Lock,
  ArrowRight,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 5.99;
const TAX_RATE = 0.08;

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart((s) => s.subtotal());

  // Hydration guard — the cart is persisted in localStorage so the server
  // render cannot know its contents. Render a neutral skeleton until mounted.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );

  if (!mounted) {
    return <CartSkeleton />;
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
            <BreadcrumbPage>Cart</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Shopping Cart
        </h1>
        <p className="text-muted-foreground">
          {items.length === 0
            ? "Your cart is currently empty."
            : `You have ${items.length} ${items.length === 1 ? "item" : "items"} in your cart.`}
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT — cart items */}
          <section aria-label="Cart items" className="min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Items ({items.reduce((n, i) => n + i.qty, 0)})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clear();
                  toast.success("Cart cleared");
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Clear cart
              </Button>
            </div>

            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.slug}>
                  <Card className="gap-0 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Thumbnail */}
                      <Link
                        href={`/products/${item.slug}`}
                        className="relative block h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </Link>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${item.slug}`}
                          className="line-clamp-2 font-semibold leading-tight hover:text-primary"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatPrice(item.price)} each
                        </p>

                        {/* Qty stepper (mobile position) */}
                        <div className="mt-3 flex items-center gap-3 sm:hidden">
                          <QtyStepper
                            qty={item.qty}
                            onDec={() => setQty(item.slug, item.qty - 1)}
                            onInc={() => setQty(item.slug, item.qty + 1)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              remove(item.slug);
                              toast.success("Item removed from cart");
                            }}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>

                      {/* Qty + line total (desktop) */}
                      <div className="hidden items-center gap-6 sm:flex">
                        <QtyStepper
                          qty={item.qty}
                          onDec={() => setQty(item.slug, item.qty - 1)}
                          onInc={() => setQty(item.slug, item.qty + 1)}
                        />
                        <div className="w-24 text-right">
                          <div className="font-semibold">
                            {formatPrice(item.price * item.qty)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              remove(item.slug);
                              toast.success("Item removed from cart");
                            }}
                            className="mt-1 h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Line total (mobile) */}
                    <div className="mt-3 flex items-center justify-end border-t border-border pt-3 sm:hidden">
                      <span className="text-sm text-muted-foreground">
                        Line total:{" "}
                        <span className="font-semibold text-foreground">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </span>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-start">
              <Button asChild variant="outline" size="sm">
                <Link href="/products">Continue shopping</Link>
              </Button>
            </div>
          </section>

          {/* RIGHT — order summary */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <Card className="gap-0 p-6">
              <h2 className="text-lg font-semibold">Order summary</h2>

              {/* Free shipping progress */}
              {remainingForFreeShipping > 0 ? (
                <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3 text-sm">
                  <p className="text-muted-foreground">
                    Add{" "}
                    <span className="font-semibold text-foreground">
                      {formatPrice(remainingForFreeShipping)}
                    </span>{" "}
                    more to unlock{" "}
                    <span className="font-medium text-primary">free shipping</span>.
                  </p>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
                  <Truck className="h-4 w-4" />
                  You&apos;ve unlocked free shipping!
                </div>
              )}

              <Separator className="my-5" />

              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">
                    Estimated tax ({Math.round(TAX_RATE * 100)}%)
                  </dt>
                  <dd className="font-medium">{formatPrice(tax)}</dd>
                </div>
              </dl>

              <Separator className="my-5" />

              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">{formatPrice(total)}</span>
              </div>

              <Button
                size="lg"
                className="mt-6 w-full"
                onClick={() => {
                  toast.success("Checkout is a demo — coming soon!", {
                    description: `Your ${formatPrice(total)} cart has been saved.`,
                  });
                }}
              >
                <Lock className="h-4 w-4" />
                Proceed to checkout
              </Button>

              <Button
                variant="outline"
                className="mt-2 w-full"
                onClick={() => {
                  clear();
                  toast.success("Cart cleared");
                }}
              >
                <Trash2 className="h-4 w-4" />
                Clear cart
              </Button>

              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
                <div className="flex flex-col items-center gap-1 rounded-md border border-border p-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Secure checkout
                </div>
                <div className="flex flex-col items-center gap-1 rounded-md border border-border p-3">
                  <Truck className="h-5 w-5 text-primary" />
                  Fast shipping
                </div>
                <div className="flex flex-col items-center gap-1 rounded-md border border-border p-3">
                  <Lock className="h-5 w-5 text-primary" />
                  Data protected
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Taxes and shipping calculated at checkout. Demo store — no real
                payment is processed.
              </p>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}

function QtyStepper({
  qty,
  onDec,
  onInc,
}: {
  qty: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div
      className="inline-flex items-center rounded-md border border-border bg-background"
      role="group"
      aria-label="Quantity"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-r-none"
        onClick={onDec}
        disabled={qty <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span
        className="min-w-8 text-center text-sm font-medium tabular-nums"
        aria-live="polite"
      >
        {qty}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-l-none"
        onClick={onInc}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
        <ShoppingCart className="h-10 w-10" />
      </span>
      <h2 className="mt-6 text-2xl font-bold tracking-tight">
        Your cart is empty
      </h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Looks like you haven&apos;t added anything yet. Browse our components,
        kits, and tools to get started on your next build.
      </p>
      <Button asChild size="lg" className="mt-6">
        <Link href="/products">
          Browse products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-primary" /> Quality tested
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Truck className="h-4 w-4 text-primary" /> Fast worldwide shipping
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-4 w-4 text-primary" /> Secure checkout
        </span>
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="container-page py-6 md:py-10">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-6 h-9 w-64" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className={cn("h-28 w-full rounded-xl")} />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  );
}
