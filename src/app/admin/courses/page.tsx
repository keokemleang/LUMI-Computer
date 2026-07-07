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
import { getCourses } from "@/lib/data";
import { AddButton } from "../add-button";
import { RowActions } from "../row-actions";
import { MobileRowActions } from "../mobile-row-actions";
import { DIFFICULTY_BADGE, badgeClass, formatCurrency } from "../helpers";

export const metadata = { title: "Courses" };

export default async function AdminCoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Project-based video courses taught by working engineers.
          </p>
        </div>
        <AddButton
          label="Add course"
          toastTitle="Add course (demo)"
          toastDescription="A course form would open here."
        />
      </div>

      <Card className="gap-0 p-0">
        <CardContent className="px-0">
          {/* Mobile: card list */}
          <div className="space-y-3 px-4 py-4 sm:hidden">
            {courses.map((c) => (
              <div key={c.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {c.description}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {c.price === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      formatCurrency(c.price)
                    )}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 font-medium ${badgeClass(
                      DIFFICULTY_BADGE,
                      c.difficulty
                    )}`}
                  >
                    {c.difficulty}
                  </span>
                  <span className="text-muted-foreground">{c.instructor}</span>
                  <span className="text-muted-foreground">
                    {c.lessonsCount} lessons
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="font-medium text-foreground">
                      {c.rating.toFixed(1)}
                    </span>
                    ({c.reviewCount})
                  </span>
                </div>
                <MobileRowActions
                  viewHref={`/courses/${c.slug}`}
                  itemName={c.title}
                />
              </div>
            ))}
            {courses.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No courses yet.
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
                    <TableHead className="hidden md:table-cell">Instructor</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden lg:table-cell">Lessons</TableHead>
                    <TableHead className="hidden lg:table-cell">Rating</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="pl-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{c.title}</span>
                          <span className="line-clamp-1 max-w-md text-xs text-muted-foreground">
                            {c.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {c.instructor}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                            badgeClass(DIFFICULTY_BADGE, c.difficulty)
                          }`}
                        >
                          {c.difficulty}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {c.price === 0 ? (
                          <span className="text-success">Free</span>
                        ) : (
                          formatCurrency(c.price)
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {c.lessonsCount} lessons
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                          <span className="font-medium">{c.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">
                            ({c.reviewCount})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <RowActions
                          viewHref={`/courses/${c.slug}`}
                          itemName={c.title}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {courses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                        No courses yet.
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
