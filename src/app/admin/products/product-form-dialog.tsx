"use client";

import * as React from "react";
import { Loader2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export interface ProductFormValue {
  name: string;
  slug: string;
  sku: string;
  shortDesc: string;
  price: string;
  compareAt: string;
  stock: string;
  categoryId: string;
  featured: boolean;
  description: string;
}

export interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: { id: string; name: string; slug: string }[];
  initial?: Partial<ProductFormValue>;
  mode: "create" | "edit";
}

export function ProductFormDialog({
  open,
  onOpenChange,
  categories,
  initial,
  mode,
}: ProductFormDialogProps) {
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<ProductFormValue>({
    name: "",
    slug: "",
    sku: "",
    shortDesc: "",
    price: "",
    compareAt: "",
    stock: "",
    categoryId: categories[0]?.id ?? "",
    featured: false,
    description: "",
  });

  React.useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name ?? "",
        slug: initial?.slug ?? "",
        sku: initial?.sku ?? "",
        shortDesc: initial?.shortDesc ?? "",
        price: initial?.price ?? "",
        compareAt: initial?.compareAt ?? "",
        stock: initial?.stock ?? "",
        categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
        featured: initial?.featured ?? false,
        description: initial?.description ?? "",
      });
    }
  }, [open, initial, categories]);

  function update<K extends keyof ProductFormValue>(key: K, value: ProductFormValue[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!form.sku.trim()) {
      toast.error("SKU is required");
      return;
    }
    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      onOpenChange(false);
      toast.success(
        mode === "create" ? "Product saved (demo)" : "Product updated (demo)",
        {
          description: `${form.name} — changes are simulated.`,
        }
      );
    }, 600);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add product" : "Edit product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new product in your catalog."
              : "Update product details. Changes are simulated in this demo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pf-name">Name</Label>
              <Input
                id="pf-name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. ESP32 DevKit V1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-slug">Slug</Label>
              <Input
                id="pf-slug"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="esp32-devkit-v1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-sku">SKU</Label>
              <Input
                id="pf-sku"
                value={form.sku}
                onChange={(e) => update("sku", e.target.value)}
                placeholder="KBS-ESP32-001"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-price">Price (USD)</Label>
              <Input
                id="pf-price"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="12.99"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-compare">Compare-at price</Label>
              <Input
                id="pf-compare"
                value={form.compareAt}
                onChange={(e) => update("compareAt", e.target.value)}
                placeholder="17.99"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-stock">Stock</Label>
              <Input
                id="pf-stock"
                value={form.stock}
                onChange={(e) => update("stock", e.target.value)}
                placeholder="50"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-category">Category</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => update("categoryId", v)}
              >
                <SelectTrigger id="pf-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pf-short">Short description</Label>
              <Input
                id="pf-short"
                value={form.shortDesc}
                onChange={(e) => update("shortDesc", e.target.value)}
                placeholder="One-line summary shown on cards"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pf-desc">Description</Label>
              <Textarea
                id="pf-desc"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                placeholder="Full product description"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3 sm:col-span-2">
              <div>
                <p className="text-sm font-medium">Featured product</p>
                <p className="text-xs text-muted-foreground">
                  Featured products appear on the homepage.
                </p>
              </div>
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => update("featured", v)}
                aria-label="Featured"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {mode === "create" ? "Create product" : "Save changes"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
