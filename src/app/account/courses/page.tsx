import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, PlayCircle, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getCourses } from "@/lib/data";
import { cn } from "@/lib/utils";

const difficultyBadge: Record<string, string> = {
  Beginner: "bg-success text-success-foreground",
  Intermediate: "bg-warning text-warning-foreground",
  Advanced: "bg-danger text-danger-foreground",
};

// Deterministic mock progress per course slug — keeps the demo stable.
function mockProgress(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return 20 + (Math.abs(h) % 75); // 20%..94%
}

export default async function MyCoursesPage() {
  const courses = await getCourses();
  const enrolled = courses.slice(0, 4);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Courses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Continue where you left off or explore new material.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/courses">
            Browse all courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      {enrolled.length === 0 ? (
        <Card className="p-0">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
              <GraduationCap className="h-8 w-8" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">
              You aren&apos;t enrolled in any courses yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Browse our catalog of project-based courses to start learning.
            </p>
            <Button asChild className="mt-5">
              <Link href="/courses">Browse courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {enrolled.map((course) => {
              const progress = mockProgress(course.slug);
              const diffClass =
                difficultyBadge[course.difficulty] ??
                "bg-secondary text-secondary-foreground";
              return (
                <Card key={course.id} className="gap-0 p-0 overflow-hidden">
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <Badge
                      className={cn(
                        "absolute left-3 top-3",
                        diffClass
                      )}
                    >
                      {course.difficulty}
                    </Badge>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="line-clamp-1 text-lg font-semibold text-white drop-shadow">
                        {course.title}
                      </h3>
                      <p className="text-xs text-white/85">
                        by {course.instructor}
                      </p>
                    </div>
                  </div>

                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <PlayCircle className="h-3.5 w-3.5" />
                        {course.lessonsCount} lessons
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {course.duration}
                      </span>
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium tabular-nums">
                          {progress}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/courses/${course.slug}`}>
                        Continue learning
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center pt-2">
            <Button asChild variant="outline">
              <Link href="/courses">
                Browse more courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
