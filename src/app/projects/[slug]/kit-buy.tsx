"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingCart, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

interface KitBuyProps {
  slug: string;
  name: string;
  price: number;
  image: string;
  stock?: number;
}

export function KitBuy({ slug, name, price, image, stock }: KitBuyProps) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = React.useState(false);

  const outOfStock = typeof stock === "number" && stock <= 0;

  const handleAdd = React.useCallback(() => {
    add({ slug, name, price, image }, 1);
    setAdded(true);
    toast.success(`Added ${name} to cart`);
    window.setTimeout(() => setAdded(false), 1500);
  }, [add, slug, name, price, image]);

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        size="lg"
        className="w-full"
        onClick={handleAdd}
        disabled={outOfStock}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" /> Added to cart
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </>
        )}
      </Button>
      <Button asChild type="button" size="sm" variant="ghost" className="w-full">
        <Link href={`/products/${slug}`}>
          View kit <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
