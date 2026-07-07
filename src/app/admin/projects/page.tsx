import { Star } from "lucide-react";
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
import { getProjects } from "@/lib/data";
import { AddButton } from "../add-button";
import { RowActions } from "../row-actions";
import { DIFFICULTY_BADGE, badgeClass } from "../helpers";

export const metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hands-on project kits with code, wiring, and documentation.
          </p>
        </div>
        <AddButton
          label="Add project"
          toastTitle="Add project (demo)"
          toastDescription="A project form would open here."
        />
      </div>

      <Card className="gap-0 p-0">
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Rating</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pl-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{p.title}</span>
                      <span className="line-clamp-1 max-w-md text-xs text-muted-foreground">
                        {p.overview}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                        badgeClass(DIFFICULTY_BADGE, p.difficulty)
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {p.category ?? "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      <span className="font-medium">{p.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">
                        ({p.reviewCount})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {p.featured ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                        <Star className="h-3 w-3 fill-warning" />
                        Featured
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <RowActions
                      viewHref={`/projects/${p.slug}`}
                      itemName={p.title}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    No projects yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
