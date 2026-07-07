"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AddToCartProps {
  slug: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export function AddToCart({ slug, name, price, image, stock }: AddToCartProps) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const hasWish = useWishlist((s) => s.has);
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);

  const outOfStock = stock <= 0;
  const wished = hasWish(slug);

  const handleAdd = React.useCallback(() => {
    add({ slug, name, price, image }, qty);
    setAdded(true);
    toast.success(`Added ${qty} × ${name} to cart`);
    window.setTimeout(() => setAdded(false), 1500);
  }, [add, slug, name, price, image, qty]);

  const handleBuyNow = React.useCallback(() => {
    add({ slug, name, price, image }, qty);
    toast.success(`Added ${qty} × ${name} to cart`);
    router.push("/cart");
  }, [add, router, slug, name, price, image, qty]);

  const handleWish = React.useCallback(() => {
    toggleWish({ slug, name, price, image });
    toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
  }, [toggleWish, wished, slug, name, price, image]);

  return (
    <div className="space-y-4">
      {/* Quantity + wishlist */}
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border border-border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-r-none"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={outOfStock || qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <input
            aria-label="Quantity"
            type="number"
            min={1}
            max={Math.max(1, stock)}
            value={qty}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (Number.isFinite(v) && v > 0) {
                setQty(Math.min(v, Math.max(1, stock)));
              }
            }}
            className="h-9 w-12 border-x border-border bg-transparent text-center text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            disabled={outOfStock}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-l-none"
            onClick={() => setQty((q) => Math.min(Math.max(1, stock), q + 1))}
            disabled={outOfStock || qty >= stock}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={handleWish}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              wished && "fill-destructive text-destructive"
            )}
          />
        </Button>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          size="lg"
          className="flex-1"
          onClick={handleAdd}
          disabled={outOfStock}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> Added
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </>
          )}
        </Button>
        <Button
          type="button"
          size="lg"
          variant="secondary"
          className="flex-1"
          onClick={handleBuyNow}
          disabled={outOfStock}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
