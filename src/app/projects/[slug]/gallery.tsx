"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GalleryProps {
  images: string[];
  alt: string;
}

const FALLBACK =
  "https://picsum.photos/seed/project-placeholder/1200/750";

export function Gallery({ images, alt }: GalleryProps) {
  const safeImages = images.length > 0 ? images : [FALLBACK];
  const [active, setActive] = React.useState(0);

  // Reset active index if the list changes (e.g. navigating between projects).
  React.useEffect(() => {
    setActive(0);
  }, [images]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted">
        <Image
          src={safeImages[active] ?? FALLBACK}
          alt={`${alt} — image ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 760px"
          className="object-cover"
        />
      </div>
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {safeImages.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={active === i}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted transition-all",
                active === i
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/50"
              )}
            >
              <Image
                src={src}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
