"use client";

import * as React from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

interface AddToCartButtonProps {
  slug: string;
  title: string;
  price: number;
  thumbnail: string;
}

export function AddToCartButton({
  slug,
  title,
  price,
  thumbnail,
}: AddToCartButtonProps) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = React.useState(false);

  const handleAdd = React.useCallback(() => {
    add({ slug, name: title, price, image: thumbnail }, 1);
    setAdded(true);
    toast.success(`Added ${title} to cart`);
    window.setTimeout(() => setAdded(false), 1500);
  }, [add, slug, title, price, thumbnail]);

  return (
    <Button
      type="button"
      size="lg"
      variant="outline"
      className="w-full"
      onClick={handleAdd}
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
  );
}
