"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Save, Upload, X, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const EMPTY_FORM = {
  name: "",
  slug: "",
  brand: "",
  sku: "",
  shortDesc: "",
  price: "",
  compareAt: "",
  stock: "",
  categoryId: "",
  featured: false,
  description: "",
  images: [],
  specs: []
};

export function ProductFormDialog({
  open,
  onOpenChange,
  categories,
  initial,
  mode
}) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [form, setForm] = React.useState(EMPTY_FORM);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setForm({
        ...EMPTY_FORM,
        ...initial,
        categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
        images: initial?.images ?? [],
        specs: initial?.specs ?? []
      });
    }
  }, [open, initial, categories]);

  function update(key, value) {
    setForm(f => ({
      ...f,
      [key]: value
    }));
  }

  async function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          toast.error(data.error || `Failed to upload ${file.name}`);
          continue;
        }
        setForm(f => ({
          ...f,
          images: [...f.images, data.url]
        }));
      }
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url) {
    setForm(f => ({
      ...f,
      images: f.images.filter(i => i !== url)
    }));
  }

  function addSpec() {
    setForm(f => ({
      ...f,
      specs: [...f.specs, {
        label: "",
        value: ""
      }]
    }));
  }
  function updateSpec(index, key, value) {
    setForm(f => ({
      ...f,
      specs: f.specs.map((s, i) => i === index ? {
        ...s,
        [key]: value
      } : s)
    }));
  }
  function removeSpec(index) {
    setForm(f => ({
      ...f,
      specs: f.specs.filter((_, i) => i !== index)
    }));
  }

  async function handleSubmit(e) {
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
    if (!form.price || Number.isNaN(Number(form.price))) {
      toast.error("A valid price is required");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug,
      brand: form.brand,
      sku: form.sku,
      shortDesc: form.shortDesc,
      description: form.description,
      price: form.price,
      compareAt: form.compareAt === "" ? null : form.compareAt,
      stock: form.stock === "" ? 0 : form.stock,
      categoryId: form.categoryId,
      featured: form.featured,
      images: form.images,
      specs: form.specs.filter(s => s.label.trim() || s.value.trim())
    };

    try {
      const url = mode === "create" ? "/api/admin/products" : `/api/admin/products/${initial.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error || "Failed to save product");
        return;
      }
      toast.success(mode === "create" ? "Product created" : "Product updated", {
        description: form.name
      });
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setSaving(false);
    }
  }

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add product" : "Edit product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Create a new product in your catalog." : "Update product details, stock, and images."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pf-name">Name</Label>
              <Input id="pf-name" value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Ryzen 7 7800X3D" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-brand">Brand</Label>
              <Input id="pf-brand" value={form.brand} onChange={e => update("brand", e.target.value)} placeholder="AMD, Intel, ASUS…" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-slug">Slug</Label>
              <Input id="pf-slug" value={form.slug} onChange={e => update("slug", e.target.value)} placeholder="auto-generated from name if blank" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-sku">SKU</Label>
              <Input id="pf-sku" value={form.sku} onChange={e => update("sku", e.target.value)} placeholder="LUMI-CPU-001" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-category">Category</Label>
              <Select value={form.categoryId} onValueChange={v => update("categoryId", v)}>
                <SelectTrigger id="pf-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-price">Price (USD)</Label>
              <Input id="pf-price" value={form.price} onChange={e => update("price", e.target.value)} placeholder="399.00" inputMode="decimal" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-compare">Compare-at price</Label>
              <Input id="pf-compare" value={form.compareAt} onChange={e => update("compareAt", e.target.value)} placeholder="449.00" inputMode="decimal" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pf-stock">Stock quantity</Label>
              <Input id="pf-stock" value={form.stock} onChange={e => update("stock", e.target.value)} placeholder="50" inputMode="numeric" />
            </div>

            {/* Images */}
            <div className="space-y-2 sm:col-span-2">
              <Label>Images</Label>
              <div className="flex flex-wrap gap-3">
                {form.images.map(url => <div key={url} className="group relative h-20 w-20 overflow-hidden rounded-md border border-border bg-muted">
                    <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                    <button type="button" onClick={() => removeImage(url)} className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow transition-opacity group-hover:opacity-100" aria-label="Remove image">
                      <X className="h-3 w-3" />
                    </button>
                  </div>)}
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="grid h-20 w-20 place-items-center rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50">
                  {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
              </div>
              <p className="text-xs text-muted-foreground">Uploads to Cloudinary. JPG/PNG/WebP, up to 8MB each.</p>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pf-short">Short description</Label>
              <Input id="pf-short" value={form.shortDesc} onChange={e => update("shortDesc", e.target.value)} placeholder="One-line summary shown on cards" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pf-desc">Description</Label>
              <Textarea id="pf-desc" value={form.description} onChange={e => update("description", e.target.value)} rows={4} placeholder="Full product description" />
            </div>

            {/* Specs */}
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label>Specifications</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSpec}>
                  <Plus className="h-3.5 w-3.5" />
                  Add spec
                </Button>
              </div>
              {form.specs.length === 0 && <p className="text-xs text-muted-foreground">No specs added yet.</p>}
              <div className="space-y-2">
                {form.specs.map((s, i) => <div key={i} className="flex items-center gap-2">
                    <Input value={s.label} onChange={e => updateSpec(i, "label", e.target.value)} placeholder="Socket" className="flex-1" />
                    <Input value={s.value} onChange={e => updateSpec(i, "value", e.target.value)} placeholder="AM5" className="flex-1" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(i)} aria-label="Remove spec">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>)}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3 sm:col-span-2">
              <div>
                <p className="text-sm font-medium">Featured product</p>
                <p className="text-xs text-muted-foreground">
                  Featured products appear on the homepage.
                </p>
              </div>
              <Switch checked={form.featured} onCheckedChange={v => update("featured", v)} aria-label="Featured" />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || uploading}>
              {saving ? <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </> : <>
                  <Save className="h-4 w-4" />
                  {mode === "create" ? "Create product" : "Save changes"}
                </>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>;
}
