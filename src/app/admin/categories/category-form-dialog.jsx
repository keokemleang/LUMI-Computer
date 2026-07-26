"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Save, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  image: "",
  featured: false
};

export function CategoryFormDialog({
  open,
  onOpenChange,
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
        ...initial
      });
    }
  }, [open, initial]);

  function update(key, value) {
    setForm(f => ({
      ...f,
      [key]: value
    }));
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error || "Failed to upload image");
        return;
      }
      update("image", data.url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    try {
      const url = mode === "create" ? "/api/admin/categories" : `/api/admin/categories/${initial.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error || "Failed to save category");
        return;
      }
      toast.success(mode === "create" ? "Category created" : "Category updated", {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add category" : "Edit category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Create a new product category." : "Update category details."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cf-name">Name</Label>
            <Input id="cf-name" value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Graphics Cards" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cf-slug">Slug</Label>
            <Input id="cf-slug" value={form.slug} onChange={e => update("slug", e.target.value)} placeholder="auto-generated from name if blank" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cf-desc">Description</Label>
            <Textarea id="cf-desc" value={form.description} onChange={e => update("description", e.target.value)} rows={3} placeholder="Shown on the category page" />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex items-center gap-3">
              {form.image ? <div className="group relative h-16 w-16 overflow-hidden rounded-md border border-border bg-muted">
                  <Image src={form.image} alt="" fill sizes="64px" className="object-cover" />
                  <button type="button" onClick={() => update("image", "")} className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow transition-opacity group-hover:opacity-100" aria-label="Remove image">
                    <X className="h-3 w-3" />
                  </button>
                </div> : <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="grid h-16 w-16 place-items-center rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50">
                  {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                </button>}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Featured category</p>
              <p className="text-xs text-muted-foreground">
                Featured categories appear on the homepage.
              </p>
            </div>
            <Switch checked={form.featured} onCheckedChange={v => update("featured", v)} aria-label="Featured" />
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
                  {mode === "create" ? "Create category" : "Save changes"}
                </>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>;
}
