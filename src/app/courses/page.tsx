import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCourses, type CourseParsed } from "@/lib/data";
import { CoursesView } from "./courses-view";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Project-based engineering courses taught by working engineers. Learn Arduino, ESP32, STM32, and PCB design with hands-on labs.",
};

// Pass only the fields the view + CourseCard need (and that are safely
// serializable across the server→client boundary).
type CourseLite = Pick<
  CourseParsed,
  | "slug"
  | "title"
  | "description"
  | "thumbnail"
  | "instructor"
  | "difficulty"
  | "duration"
  | "lessonsCount"
  | "price"
  | "rating"
  | "reviewCount"
>;

export default async function CoursesPage() {
  const courses = await getCourses();
  const initial: CourseLite[] = courses.map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description,
    thumbnail: c.thumbnail,
    instructor: c.instructor,
    difficulty: c.difficulty,
    duration: c.duration,
    lessonsCount: c.lessonsCount,
    price: c.price,
    rating: c.rating,
    reviewCount: c.reviewCount,
  }));

  return (
    <div className="container-page py-8 md:py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Courses</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Courses
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Project-based learning taught by working engineers.
        </p>
      </header>

      <div className="mt-8">
        <CoursesView courses={initial} />
      </div>
    </div>
  );
}
