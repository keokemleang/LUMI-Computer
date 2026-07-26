"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
export function ProductCard({
  product,
  className
}) {
  const add = useCart(s => s.add);
  const toggleWish = useWishlist(s => s.toggle);
  const hasWish = useWishlist(s => s.has);
  const [added, setAdded] = useAddedState();
  const wished = hasWish(product.slug);
  const discount = product.compareAt ? Math.round((product.compareAt - product.price) / product.compareAt * 100) : 0;
  return <Card className={cn("group flex flex-col overflow-hidden p-0 transition-shadow hover:shadow-md", className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Link href={`/products/${product.slug}`} className="relative block h-full w-full">
          <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
        </Link>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
          {product.stock <= 0 && <Badge variant="secondary">Out of stock</Badge>}
          {product.stock > 0 && product.stock < 10 && <Badge className="bg-warning text-warning-foreground">Low stock</Badge>}
        </div>
        <button onClick={() => {
        toggleWish({
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0]
        });
        toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
      }} aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background">
          <Heart className={cn("h-4 w-4", wished && "fill-destructive text-destructive")} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link href={`/categories/${product.category.slug}`} className="text-xs font-medium text-primary hover:underline">
          {product.category.name}
        </Link>
        <Link href={`/products/${product.slug}`} className="mt-1">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-tight hover:text-primary sm:min-h-[2.75rem] sm:text-base">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-xs text-muted-foreground sm:text-sm">{product.shortDesc}</p>
        <div className="mt-2">
          <StarRating rating={product.rating} showValue count={product.reviewCount} />
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="flex min-w-0 flex-col">
            <span className="text-base font-bold sm:text-lg">${product.price.toFixed(2)}</span>
            {product.compareAt && <span className="text-xs text-muted-foreground line-through">
                ${product.compareAt.toFixed(2)}
              </span>}
          </div>
          <Button size="sm" variant={added ? "secondary" : "default"} className="h-9 shrink-0 px-3 sm:h-9" onClick={() => {
          add({
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0]
          });
          setAdded();
          toast.success("Added to cart");
        }}>
            {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
    </Card>;
}
function useAddedState() {
  const [added, setAdded] = React.useState(false);
  const timer = React.useRef(null);
  const set = React.useCallback(() => {
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1500);
  }, []);
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  return [added, set];
}
