import { Plus, Star } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategories } from "@/lib/data";
import { db } from "@/lib/db";
import { AddButton } from "../add-button";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const [categories, counts] = await Promise.all([
    getCategories(),
    db.product.groupBy({
      by: ["categoryId"],
      _count: { _all: true },
    }),
  ]);

  const countMap = new Map<string, number>();
  for (const c of counts) countMap.set(c.categoryId, c._count._all);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize your catalog with categories and sub-categories.
          </p>
        </div>
        <AddButton
          label="Add category"
          toastTitle="Add category (demo)"
          toastDescription="A category form would open here."
        />
      </div>

      <Card className="gap-0 p-0">
        <CardContent className="px-0">
          {/* Mobile: card list */}
          <div className="space-y-3 px-4 py-4 sm:hidden">
            {categories.map((c) => (
              <div key={c.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                    <Plus className="h-4 w-4 rotate-45" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      {c.featured ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                          <Star className="h-3 w-3 fill-warning" />
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">{c.slug}</p>
                  </div>
                </div>
                {c.description ? (
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {c.description}
                  </p>
                ) : null}
                <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                    {countMap.get(c.id) ?? 0}{" "}
                    {(countMap.get(c.id) ?? 0) === 1 ? "product" : "products"}
                  </span>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No categories yet.
              </p>
            )}
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((c) => (
                    <TableRow key={c.id}>
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
                          {countMap.get(c.id) ?? 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        {c.featured ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                            <Star className="h-3 w-3 fill-warning" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {categories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                        No categories yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
