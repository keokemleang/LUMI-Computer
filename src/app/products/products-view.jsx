"use client";

import * as React from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, PackageSearch } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
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
export function ProductsView({
  products,
  categories,
  initialCategory
}) {
  const [activeCategory, setActiveCategory] = React.useState(initialCategory || "all");
  const [sort, setSort] = React.useState("featured");
  const [query, setQuery] = React.useState("");

  // Keep state in sync if the URL ?category= changes (e.g. user clicks a link)
  React.useEffect(() => {
    setActiveCategory(initialCategory || "all");
  }, [initialCategory]);
  const filtered = React.useMemo(() => {
    let list = products.slice();
    if (activeCategory !== "all") {
      list = list.filter(p => p.category.slug === activeCategory);
    }
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
  }, [products, activeCategory, sort, query]);
  const activeCatName = activeCategory === "all" ? "All Products" : categories.find(c => c.slug === activeCategory)?.name || "Products";
  return <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-6">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" /> Categories
            </h2>
            <nav className="mt-3 flex flex-col gap-1">
              <CategoryLink href="/products" label="All Products" count={products.length} active={activeCategory === "all"} onClick={() => setActiveCategory("all")} />
              {categories.map(c => {
              const count = products.filter(p => p.category.slug === c.slug).length;
              return <CategoryLink key={c.id} href={`/products?category=${c.slug}`} label={c.name} count={count} active={activeCategory === c.slug} onClick={() => setActiveCategory(c.slug)} />;
            })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div>
        {/* Mobile category select */}
        <div className="lg:hidden">
          <Select value={activeCategory} onValueChange={v => setActiveCategory(v)}>
            <SelectTrigger className="w-full" aria-label="Filter by category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {categories.map(c => <SelectItem key={c.id} value={c.slug}>
                  {c.name}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Toolbar */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mt-0">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "product" : "products"}
            {activeCategory !== "all" && <>
                {" "}
                in{" "}
                <Link href={`/categories/${activeCategory}`} className="font-medium text-primary hover:underline">
                  {activeCatName}
                </Link>
              </>}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products…" aria-label="Search products" className="pl-8 sm:w-56" />
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
          </div> : <EmptyState />}
      </div>
    </div>;
}
function CategoryLink({
  href,
  label,
  count,
  active,
  onClick
}) {
  return <Link href={href} onClick={onClick} className={cn("flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors", active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}>
      <span>{label}</span>
      <span className={cn("rounded-full px-2 py-0.5 text-xs", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
        {count}
      </span>
    </Link>;
}
function EmptyState() {
  return <div className="mt-10 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <PackageSearch className="h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No products found</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try a different category, clear your search, or browse all products.
      </p>
    </div>;
}
