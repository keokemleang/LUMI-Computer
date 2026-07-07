import { Download, FileText } from "lucide-react";
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
import { getDownloads } from "@/lib/data";
import { AddButton } from "../add-button";
import { RowActions } from "../row-actions";
import { MobileRowActions } from "../mobile-row-actions";
import { DOWNLOAD_CATEGORY_BADGE, badgeClass, formatDate } from "../helpers";

export const metadata = { title: "Downloads" };

export default async function AdminDownloadsPage() {
  const downloads = await getDownloads();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Downloads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Source code, PCB files, datasheets, manuals, and libraries.
          </p>
        </div>
        <AddButton
          label="Add download"
          toastTitle="Add download (demo)"
          toastDescription="A download form would open here."
        />
      </div>

      <Card className="gap-0 p-0">
        <CardContent className="px-0">
          {/* Mobile: card list */}
          <div className="space-y-3 px-4 py-4 sm:hidden">
            {downloads.map((d) => (
              <div key={d.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{d.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {d.description}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 font-medium ${badgeClass(
                      DOWNLOAD_CATEGORY_BADGE,
                      d.category
                    )}`}
                  >
                    {d.category}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-mono uppercase text-muted-foreground">
                    {d.fileType}
                  </span>
                  <span className="text-muted-foreground">{d.fileSize}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span className="font-medium text-foreground">
                      {d.downloads.toLocaleString()}
                    </span>{" "}
                    downloads
                  </span>
                  <span>Added {formatDate(d.createdAt)}</span>
                </div>
                <MobileRowActions itemName={d.title} />
              </div>
            ))}
            {downloads.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No downloads yet.
              </p>
            )}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block">
            <div className="scroll-area-thin overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">File type</TableHead>
                    <TableHead className="hidden md:table-cell">Size</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead className="hidden lg:table-cell">Added</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloads.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                            <FileText className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{d.title}</p>
                            <p className="line-clamp-1 max-w-md text-xs text-muted-foreground">
                              {d.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                            badgeClass(DOWNLOAD_CATEGORY_BADGE, d.category)
                          }`}
                        >
                          {d.category}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-mono text-xs uppercase text-muted-foreground">
                          {d.fileType}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {d.fileSize}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-sm">
                          <Download className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium">
                            {d.downloads.toLocaleString()}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {formatDate(d.createdAt)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <RowActions itemName={d.title} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {downloads.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                        No downloads yet.
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
