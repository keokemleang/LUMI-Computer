import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  PlayCircle,
  Clock,
  BarChart3,
  BookOpen,
  Check,
  X,
  MessageSquare,
  GraduationCap,
  Award,
  Download,
  Smartphone,
  ChevronRight,
  Cpu,
  FolderGit2,
  MonitorPlay,
  Star,
  User,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/star-rating";
import { cn } from "@/lib/utils";
import { getCourseBySlug, getReviews, type CourseParsed } from "@/lib/data";
import { EnrollButton } from "./enroll-button";
import { AddToCartButton } from "./add-to-cart";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) {
    return { title: "Course not found" };
  }
  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [{ url: course.thumbnail }],
      type: "website",
    },
  };
}

const difficultyBadge: Record<string, string> = {
  Beginner: "bg-success text-success-foreground",
  Intermediate: "bg-warning text-warning-foreground",
  Advanced: "bg-danger text-danger-foreground",
};

// Derive initials from an instructor name (e.g. "Eng. David Chen" → "DC").
function initials(name: string): string {
  const parts = name
    .split(/\s+/)
    .filter((p) => p.length > 0 && !/^(dr|eng|prof|mr|mrs|ms)\.?$/i.test(p));
  const picked = parts.length >= 2 ? parts.slice(-2) : parts;
  if (picked.length === 0) return name.charAt(0).toUpperCase() || "?";
  return picked
    .map((p) => p.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

// Deterministic avatar color from a string (semantic palette only).
const AVATAR_PALETTE = [
  "bg-primary/15 text-primary",
  "bg-success/15 text-success",
  "bg-warning/15 text-warning",
  "bg-danger/15 text-danger",
];
function avatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

const includedItems = [
  { icon: BookOpen, label: "Lessons count" },
  { icon: Download, label: "Downloadable resources" },
  { icon: Award, label: "Certificate of completion" },
  { icon: Smartphone, label: "Access on mobile and desktop" },
];

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const reviews = await getReviews("course", course.id);
  const isFree = course.price === 0;
  const diffClass =
    difficultyBadge[course.difficulty] || "bg-secondary text-secondary-foreground";
  const instructorInitials = initials(course.instructor);
  const instructorAvatarClass = avatarColor(course.instructor);

  // Group lessons into a single curriculum accordion where each item is one
  // lesson. Keeps the UX simple and predictable for any lesson count.
  const curriculum = course.lessons;

  return (
    <div className="container-page py-6 md:py-10">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/courses">Courses</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{course.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero — two columns */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
        {/* LEFT */}
        <div className="min-w-0 space-y-6">
          {/* Thumbnail with play overlay */}
          {course.videoUrl ? (
            <a
              href={course.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted"
              aria-label={`Watch intro video for ${course.title}`}
            >
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 720px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <PlayCircle className="h-9 w-9" />
                </span>
              </div>
              <span className="absolute bottom-3 left-3 rounded-full bg-background/85 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                Watch intro
              </span>
            </a>
          ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 720px"
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                  diffClass
                )}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                {course.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {course.duration}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <PlayCircle className="h-3.5 w-3.5" />
                {course.lessonsCount} lessons
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <StarRating rating={course.rating} size="sm" />
                <span className="ml-0.5">
                  {course.rating.toFixed(1)} ({course.reviewCount} reviews)
                </span>
              </span>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-full text-sm font-semibold",
                  instructorAvatarClass
                )}
                aria-hidden="true"
              >
                {instructorInitials}
              </span>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Instructor
                </div>
                <div className="font-medium">{course.instructor}</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — enrollment card (sticky) */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card className="gap-0 p-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {isFree ? "Free" : `$${course.price.toFixed(2)}`}
              </span>
              {!isFree && (
                <span className="text-sm text-muted-foreground">one-time</span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {isFree
                ? "No cost — start learning right away."
                : "Lifetime access. 30-day money-back guarantee."}
            </p>

            <div className="mt-5 space-y-3">
              <EnrollButton title={course.title} price={course.price} />
              <AddToCartButton
                slug={course.slug}
                title={course.title}
                price={course.price}
                thumbnail={course.thumbnail}
              />
            </div>

            <Separator className="my-5" />

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                This course includes
              </div>
              <ul className="mt-3 space-y-2.5">
                {includedItems.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="text-foreground">
                      {item.label === "Lessons count"
                        ? `${course.lessonsCount} lessons`
                        : item.label}
                    </span>
                    <Check className="ml-auto h-4 w-4 text-success" />
                  </li>
                ))}
              </ul>
            </div>

            {course.downloadsUrl && (
              <Button asChild variant="ghost" size="sm" className="mt-4 w-full">
                <a
                  href={course.downloadsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" /> Course resources
                </a>
              </Button>
            )}
          </Card>
        </aside>
      </div>

      {/* Below hero — full-width sections */}
      <div className="mt-12 space-y-12">
        {/* What you'll learn */}
        <section aria-labelledby="learn-heading">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 id="learn-heading" className="text-2xl font-bold tracking-tight">
              What you&apos;ll learn
            </h2>
          </div>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            <Card className="p-5 md:col-span-1">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {course.overview}
              </p>
            </Card>
            <div className="md:col-span-2">
              {course.projectsIncluded.length > 0 ? (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {course.projectsIncluded.map((p, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3 text-sm"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span className="text-foreground">
                        Build a <span className="font-medium">{p}</span> project
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Detailed learning outcomes will be added soon.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Course curriculum */}
        <section aria-labelledby="curriculum-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <MonitorPlay className="h-5 w-5 text-primary" />
                <h2
                  id="curriculum-heading"
                  className="text-2xl font-bold tracking-tight"
                >
                  Course curriculum
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {course.lessonsCount} lessons · {course.duration} of content
              </p>
            </div>
          </div>
          <Card className="mt-5 p-4 md:p-6">
            {curriculum.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {curriculum.map((lesson, i) => (
                  <AccordionItem key={i} value={`lesson-${i}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <span className="flex items-center gap-3 text-left">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-medium">{lesson.title}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-center justify-between gap-3 pl-10 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <PlayCircle className="h-4 w-4 text-primary" />
                          Video lesson
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {lesson.duration}
                        </span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-sm text-muted-foreground">
                Curriculum details coming soon.
              </p>
            )}
          </Card>
        </section>

        {/* Requirements */}
        <section aria-labelledby="requirements-heading">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            <h2
              id="requirements-heading"
              className="text-2xl font-bold tracking-tight"
            >
              Requirements
            </h2>
          </div>
          <Card className="mt-5 p-5">
            {course.requirements.length > 0 ? (
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {course.requirements.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-foreground">{r}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <X className="h-4 w-4" /> No specific prerequisites — beginners
                welcome.
              </p>
            )}
          </Card>
        </section>

        {/* Projects included */}
        <section aria-labelledby="projects-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-primary" />
                <h2
                  id="projects-heading"
                  className="text-2xl font-bold tracking-tight"
                >
                  Projects included
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Apply what you learn by building real, documented projects.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/projects">
                Browse all projects <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          {course.projectsIncluded.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {course.projectsIncluded.map((p, i) => (
                <Link
                  key={i}
                  href="/projects"
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
                >
                  <Card className="flex h-full flex-col gap-0 p-5 transition-shadow hover:shadow-md">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <FolderGit2 className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 font-semibold group-hover:text-primary">
                      {p}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Hands-on build with code, wiring, and documentation.
                    </p>
                    <span className="mt-3 text-sm font-medium text-primary">
                      View project <ChevronRight className="inline h-3.5 w-3.5" />
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="mt-5 p-5">
              <p className="text-sm text-muted-foreground">
                No projects bundled with this course yet.
              </p>
            </Card>
          )}
        </section>

        {/* Components required */}
        <section aria-labelledby="components-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                <h2
                  id="components-heading"
                  className="text-2xl font-bold tracking-tight"
                >
                  Components required
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Hardware you&apos;ll need to follow along with the lessons.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/products">
                Shop components <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Card className="mt-5 p-5">
            {course.componentsRequired.length > 0 ? (
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {course.componentsRequired.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3 text-sm"
                  >
                    <span className="flex items-center gap-2.5">
                      <Cpu className="h-4 w-4 text-primary" />
                      <span className="text-foreground">{c}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No specific hardware required — software-only course.
              </p>
            )}
          </Card>
        </section>

        {/* Instructor */}
        <section aria-labelledby="instructor-heading">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2
              id="instructor-heading"
              className="text-2xl font-bold tracking-tight"
            >
              Your instructor
            </h2>
          </div>
          <Card className="mt-5 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <span
                className={cn(
                  "grid h-16 w-16 shrink-0 place-items-center rounded-full text-xl font-bold",
                  instructorAvatarClass
                )}
                aria-hidden="true"
              >
                {instructorInitials}
              </span>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Instructor
                </div>
                <h3 className="text-lg font-semibold">{course.instructor}</h3>
                {course.instructorBio && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {course.instructorBio}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* Student reviews */}
        <section aria-labelledby="reviews-heading" id="reviews">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2
                id="reviews-heading"
                className="text-2xl font-bold tracking-tight"
              >
                Student reviews ({reviews.length})
              </h2>
            </div>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <StarRating rating={course.rating} size="md" />
                <span className="text-sm text-muted-foreground">
                  {course.rating.toFixed(1)} average
                </span>
              </div>
            )}
          </div>
          <Separator className="my-5" />
          {reviews.length > 0 ? (
            <ul className="space-y-6">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  className="border-b border-border pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-full text-sm font-semibold",
                          avatarColor(r.author)
                        )}
                      >
                        {r.author.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-medium">{r.author}</span>
                    </div>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {r.comment}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
              <Star className="h-9 w-9 text-muted-foreground" />
              <h3 className="mt-3 font-semibold">No reviews yet</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Enrolled in this course? Share your experience and help the next
                learner decide.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
