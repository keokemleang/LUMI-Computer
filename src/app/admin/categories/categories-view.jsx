"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { CategoryFormDialog } from "./category-form-dialog";

export function CategoriesView({
  categories,
  countMap
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(c) {
    setEditing(c);
    setDialogOpen(true);
  }
  function handleDelete(c) {
    toast(`Delete "${c.name}"?`, {
      description: "This can't be undone.",
      action: {
        label: "Confirm",
        onClick: async () => {
          const res = await fetch(`/api/admin/categories/${c.id}`, {
            method: "DELETE"
          });
          const data = await res.json();
          if (!res.ok || !data.ok) {
            toast.error(data.error || "Failed to delete category");
            return;
          }
          toast.success("Category deleted", {
            description: c.name
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

  const editingInitial = editing ? {
    id: editing.id,
    name: editing.name,
    slug: editing.slug,
    description: editing.description || "",
    image: editing.image || "",
    featured: editing.featured
  } : undefined;

  return <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize your catalog with categories and sub-categories.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add category
        </Button>
      </div>

      <Card className="gap-0 p-0">
        <CardContent className="px-0">
          {/* Mobile: card list */}
          <div className="space-y-3 px-4 py-4 sm:hidden">
            {categories.map(c => <div key={c.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                    <Plus className="h-4 w-4 rotate-45" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      {c.featured ? <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                          <Star className="h-3 w-3 fill-warning" />
                          Featured
                        </span> : null}
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">{c.slug}</p>
                  </div>
                </div>
                {c.description ? <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {c.description}
                  </p> : null}
                <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                    {countMap[c.id] ?? 0}{" "}
                    {(countMap[c.id] ?? 0) === 1 ? "product" : "products"}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(c)} className="flex-1">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(c)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>)}
            {categories.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">
                No categories yet.
              </p>}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block">
            <div className="scroll-area-thin overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map(c => <TableRow key={c.id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                            <Plus className="h-4 w-4 rotate-45" />
                          </span>
                          <span className="text-sm font-medium">{c.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {c.slug}
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs">
                        <span className="line-clamp-1 text-sm text-muted-foreground">
                          {c.description ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {countMap[c.id] ?? 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        {c.featured ? <span className="inline-flex items-center gap-1 rounded-md bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                            <Star className="h-3 w-3 fill-warning" />
                            Featured
                          </span> : <span className="text-xs text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(c)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                  {categories.length === 0 && <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                        No categories yet.
                      </TableCell>
                    </TableRow>}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <CategoryFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initial={editingInitial} mode={editing ? "edit" : "create"} />
    </div>;
}
