"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
export function Gallery({
  images,
  alt
}) {
  const safeImages = images.length > 0 ? images : ["https://picsum.photos/seed/placeholder/600/600"];
  const [active, setActive] = React.useState(0);
  return <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
        <Image src={safeImages[active]} alt={`${alt} — image ${active + 1}`} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
      {safeImages.length > 1 && <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 sm:grid sm:grid-cols-4 sm:overflow-x-visible sm:pb-0 md:grid-cols-5">
          {safeImages.map((src, i) => <button key={i} type="button" onClick={() => setActive(i)} aria-label={`View image ${i + 1}`} aria-pressed={active === i} className={cn("relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border bg-muted transition-all sm:w-auto", active === i ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50")}>
              <Image src={src} alt={`${alt} thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>)}
        </div>}
    </div>;
}
