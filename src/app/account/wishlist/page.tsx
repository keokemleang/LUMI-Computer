"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist } from "@/lib/wishlist-store";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function WishlistPage() {
  const items = useWishlist((s) => s.items);
  const removeWish = useWishlist((s) => s.remove);
  const clearWish = useWishlist((s) => s.clear);
  const add = useCart((s) => s.add);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Per-item "added" transient state — keyed by slug.
  const [addedMap, setAddedMap] = React.useState<Record<string, boolean>>({});

  function handleAddToCart(item: (typeof items)[number]) {
    add(
      { slug: item.slug, name: item.name, price: item.price, image: item.image },
      1
    );
    setAddedMap((m) => ({ ...m, [item.slug]: true }));
    toast.success("Added to cart", { description: item.name });
    window.setTimeout(() => {
      setAddedMap((m) => {
        const next = { ...m };
        delete next[item.slug];
        return next;
      });
    }, 1500);
  }

  function handleMoveAll() {
    if (items.length === 0) return;
    items.forEach((item) =>
      add(
        { slug: item.slug, name: item.name, price: item.price, image: item.image },
        1
      )
    );
    toast.success(`Moved ${items.length} item${items.length === 1 ? "" : "s"} to cart`);
  }

  if (!mounted) {
    return <WishlistSkeleton />;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Wishlist</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Save items for later and move them to your cart when ready.
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearWish();
                toast.success("Wishlist cleared");
              }}
            >
              <Trash2 className="h-4 w-4" />
              Clear all
            </Button>
            <Button size="sm" onClick={handleMoveAll}>
              <ShoppingCart className="h-4 w-4" />
              Move all to cart
            </Button>
          </div>
        )}
      </header>

      {items.length === 0 ? (
        <Card className="p-0">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
              <Heart className="h-8 w-8" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">
              Your wishlist is empty
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Tap the heart icon on any product to save it here for later.
            </p>
            <Button asChild className="mt-5">
              <Link href="/products">
                Browse products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const added = !!addedMap[item.slug];
            return (
              <Card key={item.slug} className="gap-0 p-0 overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Link href={`/products/${item.slug}`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${item.name} from wishlist`}
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/80 backdrop-blur hover:bg-background hover:text-destructive"
                    onClick={() => {
                      removeWish(item.slug);
                      toast.success("Removed from wishlist");
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="space-y-3 p-4">
                  <Link
                    href={`/products/${item.slug}`}
                    className="line-clamp-2 font-semibold leading-tight hover:text-primary"
                  >
                    {item.name}
                  </Link>
                  <div className="text-lg font-bold">
                    {formatPrice(item.price)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      className="flex-1"
                      size="sm"
                      variant={added ? "secondary" : "default"}
                      onClick={() => handleAddToCart(item)}
                      disabled={added}
                    >
                      {added ? (
                        <>
                          <Check className="h-4 w-4" />
                          Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          Add to cart
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => {
                        removeWish(item.slug);
                        toast.success("Removed from wishlist");
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WishlistSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            key={i}
            className={cn("aspect-[4/3] w-full rounded-xl")}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading your wishlist…
      </div>
    </div>
  );
}
