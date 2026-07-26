"use client";

import * as React from "react";
import { Search, PackageSearch } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const SORT_OPTIONS = [{
  value: "featured",
  label: "Featured"
}, {
  value: "price-asc",
  label: "Price: Low to High"
}, {
  value: "price-desc",
  label: "Price: High to Low"
}, {
  value: "rating",
  label: "Top Rated"
}];
export function CategoryView({
  products
}) {
  const [sort, setSort] = React.useState("featured");
  const [query, setQuery] = React.useState("");
  const filtered = React.useMemo(() => {
    let list = products.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
        break;
    }
    return list;
  }, [products, sort, query]);
  return <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filtered.length}
          </span>{" "}
          {filtered.length === 1 ? "product" : "products"}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search in category…" aria-label="Search products" className="pl-8 sm:w-56" />
          </div>
          <Select value={sort} onValueChange={v => setSort(v)}>
            <SelectTrigger className="w-full sm:w-48" aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div> : <div className="mt-10 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <PackageSearch className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No products found</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {products.length === 0 ? "There are no products in this category yet. Check back soon." : "Try a different search term."}
          </p>
        </div>}
    </div>;
}
