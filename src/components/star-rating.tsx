"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  size = "sm",
  showValue = false,
  count,
}: {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
  count?: number;
}) {
  const [hover, setHover] = React.useState(0);
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= Math.round(rating);
          return (
            <Star
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              className={cn(
                size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
                filled
                  ? "fill-warning text-warning"
                  : "fill-muted text-muted-foreground/40"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-muted-foreground">
          {rating.toFixed(1)}
          {typeof count === "number" && ` (${count})`}
        </span>
      )}
    </div>
  );
}
