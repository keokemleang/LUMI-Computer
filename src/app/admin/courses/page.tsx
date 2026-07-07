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
import { DIFFICULTY_BADGE, badgeClass, formatCurrency } from "../helpers";

export const metadata = { title: "Courses" };

export default async function AdminCoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
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
        </CardContent>
      </Card>
    </div>
  );
}
