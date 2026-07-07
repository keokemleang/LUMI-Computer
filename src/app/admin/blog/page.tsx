import { Newspaper, User, Clock } from "lucide-react";
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
import { getBlogPosts } from "@/lib/data";
import { AddButton } from "../add-button";
import { RowActions } from "../row-actions";
import { MobileRowActions } from "../mobile-row-actions";
import { PUBLISH_STATUS_BADGE, badgeClass, formatDate } from "../helpers";

export const metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tutorials, announcements, and engineering deep-dives.
          </p>
        </div>
        <AddButton
          label="New post"
          toastTitle="New post (demo)"
          toastDescription="A blog editor would open here."
        />
      </div>

      <Card className="gap-0 p-0">
        <CardContent className="px-0">
          {/* Mobile: card list */}
          <div className="space-y-3 px-4 py-4 sm:hidden">
            {posts.map((p) => (
              <div key={p.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                    <Newspaper className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <span
                        className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${
                          p.published
                            ? badgeClass(PUBLISH_STATUS_BADGE, "published")
                            : badgeClass(PUBLISH_STATUS_BADGE, "draft")
                        }`}
                      >
                        {p.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {p.excerpt}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-medium">
                    {p.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {p.author}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {p.readTime}
                  </span>
                  <span>{formatDate(p.createdAt)}</span>
                </div>
                <MobileRowActions
                  viewHref={`/blog/${p.slug}`}
                  itemName={p.title}
                />
              </div>
            ))}
            {posts.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No blog posts yet.
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
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden lg:table-cell">Author</TableHead>
                    <TableHead className="hidden xl:table-cell">Read time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                            <Newspaper className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{p.title}</p>
                            <p className="line-clamp-1 max-w-md text-xs text-muted-foreground">
                              {p.excerpt}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {p.category}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {p.author}
                        </span>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {p.readTime}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${
                            p.published
                              ? badgeClass(PUBLISH_STATUS_BADGE, "published")
                              : badgeClass(PUBLISH_STATUS_BADGE, "draft")
                          }`}
                        >
                          {p.published ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {formatDate(p.createdAt)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <RowActions
                          viewHref={`/blog/${p.slug}`}
                          itemName={p.title}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {posts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                        No blog posts yet.
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
