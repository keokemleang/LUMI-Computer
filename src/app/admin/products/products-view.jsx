"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Search, Download, Eye, Pencil, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, Star, PackageX, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ProductFormDialog } from "./product-form-dialog";
import { RestockDialog } from "./restock-dialog";
import { formatCurrency, formatDate } from "../helpers";
const PAGE_SIZE = 10;
export function ProductsView({
  products,
  categories
}) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("all");
  const [page, setPage] = React.useState(1);

  // dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [restockOpen, setRestockOpen] = React.useState(false);
  const [restockTarget, setRestockTarget] = React.useState(null);
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(p => {
      if (categoryId !== "all" && p.category.id !== categoryId) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q);
    });
  }, [products, search, categoryId]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  React.useEffect(() => {
    setPage(1);
  }, [search, categoryId]);
  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(p) {
    setEditing(p);
    setDialogOpen(true);
  }
  function openRestock(p) {
    setRestockTarget(p);
    setRestockOpen(true);
  }
  function handleDelete(p) {
    toast(`Delete “${p.name}”?`, {
      description: "This will permanently remove the product from the catalog.",
      action: {
        label: "Confirm",
        onClick: async () => {
          const res = await fetch(`/api/admin/products/${p.id}`, {
            method: "DELETE"
          });
          const data = await res.json();
          if (!res.ok || !data.ok) {
            toast.error(data.error || "Failed to delete product");
            return;
          }
          toast.success("Product deleted", {
            description: `${p.name} was removed from the catalog.`
          });
          router.refresh();
        }
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}
      },
      duration: 8000
    });
  }
  function handleExport() {
    if (filtered.length === 0) {
      toast.error("No products to export");
      return;
    }
    const columns = ["name", "slug", "sku", "brand", "category", "price", "compareAt", "stock", "featured", "rating", "reviewCount"];
    const rows = filtered.map(p => [p.name, p.slug, p.sku, p.brand || "", p.category.name, p.price, p.compareAt ?? "", p.stock, p.featured ? "yes" : "no", p.rating, p.reviewCount]);
    const escape = v => {
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [columns, ...rows].map(row => row.map(escape).join(",")).join("\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kl-circuit-products-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} products`);
  }
  const editingInitial = editing ? {
    id: editing.id,
    name: editing.name,
    slug: editing.slug,
    brand: editing.brand || "",
    sku: editing.sku,
    shortDesc: editing.shortDesc,
    price: String(editing.price),
    compareAt: editing.compareAt != null ? String(editing.compareAt) : "",
    stock: String(editing.stock),
    categoryId: editing.category.id,
    featured: editing.featured,
    description: editing.description,
    images: editing.images || [],
    specs: editing.specs || []
  } : undefined;
  return <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your catalog of components, kits, and boards.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add product
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, SKU, or description…" className="pl-8" aria-label="Search products" />
        </div>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="sm:w-56" aria-label="Filter by category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Table */}
      <Card className="gap-0 p-0">
        <CardContent className="px-0">
          {/* Mobile: card list */}
          <div className="space-y-3 px-4 py-4 sm:hidden">
            {paged.map(p => {
            const lowStock = p.stock < 10;
            const out = p.stock === 0;
            return <div key={p.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-start gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                      {p.images[0] ? <Image src={p.images[0]} alt={p.name} fill sizes="44px" className="object-cover" /> : <span className="grid h-full w-full place-items-center text-muted-foreground">
                          <PackageX className="h-4 w-4" />
                        </span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {p.sku}
                          </p>
                        </div>
                        {p.featured ? <span className="inline-flex shrink-0 items-center rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                            Featured
                          </span> : <span className="inline-flex shrink-0 items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            Standard
                          </span>}
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">
                            {formatCurrency(p.price)}
                          </span>
                          {p.compareAt != null && p.compareAt > p.price && <span className="text-xs text-muted-foreground line-through">
                              {formatCurrency(p.compareAt)}
                            </span>}
                        </div>
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${out ? "bg-destructive/15 text-destructive" : lowStock ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`}>
                          {out ? "Out of stock" : `${p.stock} in stock`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{p.category.name}</span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="font-medium text-foreground">
                        {p.rating.toFixed(1)}
                      </span>
                      ({p.reviewCount})
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/products/${p.slug}`}>
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(p)} className="flex-1">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openRestock(p)} className="flex-1">
                      <PackagePlus className="h-3.5 w-3.5" />
                      Restock
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(p)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>;
          })}
            {paged.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">
                No products match your filters.
              </p>}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block">
            <div className="scroll-area-thin overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Product</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="hidden lg:table-cell">Rating</TableHead>
                    <TableHead className="hidden lg:table-cell">Status</TableHead>
                    <TableHead className="hidden xl:table-cell">Created</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map(p => {
                  const lowStock = p.stock < 10;
                  const out = p.stock === 0;
                  return <TableRow key={p.id}>
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                              {p.images[0] ? <Image src={p.images[0]} alt={p.name} fill sizes="44px" className="object-cover" /> : <span className="grid h-full w-full place-items-center text-muted-foreground">
                                  <PackageX className="h-4 w-4" />
                                </span>}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{p.name}</p>
                              <p className="font-mono text-xs text-muted-foreground">
                                {p.sku}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm">{p.category.name}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold">{formatCurrency(p.price)}</span>
                            {p.compareAt != null && p.compareAt > p.price && <span className="text-xs text-muted-foreground line-through">
                                {formatCurrency(p.compareAt)}
                              </span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${out ? "bg-destructive/15 text-destructive" : lowStock ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`}>
                            {out ? "Out of stock" : `${p.stock} in stock`}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                            <span className="font-medium">
                              {p.rating.toFixed(1)}
                            </span>
                            <span className="text-muted-foreground">({p.reviewCount})</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {p.featured ? <span className="inline-flex items-center rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                              Featured
                            </span> : <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              Standard
                            </span>}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                          {formatDate(p.createdAt)}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Product actions">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/products/${p.slug}`}>
                                  <Eye className="h-4 w-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEdit(p)}>
                                <Pencil className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openRestock(p)}>
                                <PackagePlus className="h-4 w-4" />
                                Restock
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(p)}>
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>;
                })}
                  {paged.length === 0 && <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                        No products match your filters.
                      </TableCell>
                    </TableRow>}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filtered.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1}–
            {Math.min(current * PAGE_SIZE, filtered.length)}
          </span>{" "}
          of <span className="font-medium text-foreground">{filtered.length}</span>
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled={current <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <span className="px-2 text-sm text-muted-foreground">
            {current} / {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={current >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ProductFormDialog open={dialogOpen} onOpenChange={setDialogOpen} categories={categories} initial={editingInitial} mode={editing ? "edit" : "create"} />
      <RestockDialog open={restockOpen} onOpenChange={setRestockOpen} product={restockTarget} />
    </div>;
}
