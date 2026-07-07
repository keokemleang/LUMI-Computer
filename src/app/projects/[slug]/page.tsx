import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  BarChart3,
  Tag,
  MessageSquare,
  Package,
  ExternalLink,
  Code2,
  CircuitBoard,
  FileText,
  Presentation,
  PlayCircle,
  GraduationCap,
  Check,
  ChevronRight,
  Cpu,
  Wrench,
  FolderGit2,
  ShoppingCart,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/project-card";
import { StarRating } from "@/components/star-rating";
import { cn } from "@/lib/utils";
import {
  getProjectBySlug,
  getProjects,
  getProductBySlug,
  getReviews,
  type ProjectParsed,
  type ProductWithCategory,
} from "@/lib/data";
import { Gallery } from "./gallery";
import { KitBuy } from "./kit-buy";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return { title: "Project not found" };
  }
  return {
    title: project.title,
    description: project.overview,
    openGraph: {
      title: project.title,
      description: project.overview,
      images: project.images.slice(0, 1).map((img) => ({ url: img })),
      type: "website",
    },
  };
}

const difficultyBadge: Record<string, string> = {
  Beginner: "bg-success text-success-foreground",
  Intermediate: "bg-warning text-warning-foreground",
  Advanced: "bg-danger text-danger-foreground",
};

// Map a project's category to a related course. Falls back to /courses.
function relatedCourseFor(category: string | null): {
  href: string;
  label: string;
} {
  switch (category) {
    case "IoT":
      return { href: "/courses/esp32-iot-bootcamp", label: "ESP32 IoT Bootcamp" };
    case "STM32":
      return { href: "/courses/embedded-c-stm32", label: "Embedded C on STM32" };
    case "Sensors":
      return {
        href: "/courses/arduino-fundamentals",
        label: "Arduino Fundamentals",
      };
    case "Robotics":
      return {
        href: "/courses/arduino-fundamentals",
        label: "Arduino Fundamentals",
      };
    case "Raspberry Pi":
      return { href: "/courses/esp32-iot-bootcamp", label: "ESP32 IoT Bootcamp" };
    default:
      return { href: "/courses", label: "Browse all courses" };
  }
}

function codeSnippetFor(title: string): string {
  return `// ${title} — firmware excerpt (ESP32 / Arduino)
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid     = "your-ssid";
const char* password = "your-password";
const int   RELAY_PIN = 26;

WiFiClient    net;
PubSubClient client(net);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  pinMode(RELAY_PIN, OUTPUT);
  client.setServer("broker.local", 1883);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();
  // TODO: read sensors & publish state
}`;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const [allProjects, reviews, kitProduct] = await Promise.all([
    getProjects(),
    getReviews("project", project.id),
    project.kitProductId ? getProductBySlug(project.kitProductId) : Promise.resolve(null),
  ]);

  const moreProjects = allProjects
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  const diffClass =
    difficultyBadge[project.difficulty] || "bg-secondary text-secondary-foreground";

  const relatedCourse = relatedCourseFor(project.category);

  const resourceLinks = [
    {
      href: project.sourceCodeUrl,
      label: "Source Code",
      icon: Code2,
      hint: "Full Arduino sketch on GitHub",
    },
    {
      href: project.pcbFilesUrl,
      label: "PCB Files",
      icon: CircuitBoard,
      hint: "KiCad project & Gerbers",
    },
    {
      href: project.docsUrl,
      label: "Documentation",
      icon: FileText,
      hint: "Step-by-step build guide",
    },
    {
      href: project.slidesUrl,
      label: "Slides",
      icon: Presentation,
      hint: "Project slides (PDF)",
    },
    {
      href: project.videoUrl,
      label: "Video Tutorial",
      icon: PlayCircle,
      hint: "Watch the walkthrough",
    },
  ].filter((r) => r.href);

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
              <Link href="/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{project.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero */}
      <header className="mt-6 max-w-3xl">
        {project.category && (
          <Link
            href="/projects"
            className="text-sm font-medium text-primary hover:underline"
          >
            {project.category}
          </Link>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{project.overview}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
              diffClass
            )}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            {project.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {project.estimatedTime}
          </span>
          {project.category && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <Tag className="h-3.5 w-3.5" />
              {project.category}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <StarRating rating={project.rating} size="sm" />
            <span className="ml-0.5">
              {project.rating.toFixed(1)} ({project.reviewCount} reviews)
            </span>
          </span>
        </div>
      </header>

      {/* Main two-column layout */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
        {/* LEFT */}
        <div className="min-w-0 space-y-8">
          <Gallery images={project.images} alt={project.title} />

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="circuit">Circuit Diagram</TabsTrigger>
              <TabsTrigger value="code">Source Code</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="mt-6">
              <Card className="p-6">
                <h2 className="mb-3 text-lg font-semibold">About this project</h2>
                <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                {project.tags.length > 0 && (
                  <div className="mt-5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Tags
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {project.tags.map((t) => (
                        <Badge key={t} variant="secondary">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Circuit Diagram */}
            <TabsContent value="circuit" className="mt-6">
              <Card className="p-6">
                <h2 className="mb-3 text-lg font-semibold">Circuit diagram</h2>
                {project.circuitDiagram ? (
                  <div className="relative aspect-[10/7] w-full overflow-hidden rounded-lg border border-border bg-muted">
                    <Image
                      src={project.circuitDiagram}
                      alt={`${project.title} circuit diagram`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 720px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No circuit diagram available for this project.
                  </p>
                )}
              </Card>
            </TabsContent>

            {/* Source Code */}
            <TabsContent value="code" className="mt-6">
              <Card className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">Source code</h2>
                  {project.sourceCodeUrl && (
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={project.sourceCodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Code2 className="h-4 w-4" />
                        Open on GitHub
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Below is a short excerpt of the firmware. The full sketch,
                  libraries, and wiring notes live in the repository.
                </p>
                <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm font-mono leading-relaxed text-foreground">
                  <code>{codeSnippetFor(project.title)}</code>
                </pre>
              </Card>
            </TabsContent>

            {/* Resources */}
            <TabsContent value="resources" className="mt-6">
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Project resources</h2>
                {resourceLinks.length > 0 ? (
                  <ul className="space-y-2">
                    {resourceLinks.map((r) => (
                      <li key={r.label}>
                        <a
                          href={r.href as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-accent"
                        >
                          <span className="flex items-center gap-3">
                            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                              <r.icon className="size-4" />
                            </span>
                            <span>
                              <span className="block text-sm font-medium">
                                {r.label}
                              </span>
                              <span className="block text-xs text-muted-foreground">
                                {r.hint}
                              </span>
                            </span>
                          </span>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No downloadable resources for this project yet.
                  </p>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          {/* Video tutorial embed */}
          {project.videoUrl && (
            <section aria-labelledby="video-heading">
              <h2
                id="video-heading"
                className="mb-3 text-lg font-semibold"
              >
                Video tutorial
              </h2>
              <div className="overflow-hidden rounded-xl border border-border bg-muted">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={project.videoUrl}
                    title={`${project.title} — video tutorial`}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Reviews */}
          <section aria-labelledby="reviews-heading" id="reviews">
            <div className="flex items-center justify-between">
              <h2 id="reviews-heading" className="text-lg font-semibold">
                Builder reviews ({reviews.length})
              </h2>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={project.rating} size="md" />
                  <span className="text-sm text-muted-foreground">
                    {project.rating.toFixed(1)} average
                  </span>
                </div>
              )}
            </div>
            <Separator className="my-4" />
            {reviews.length > 0 ? (
              <ul className="space-y-6">
                {reviews.map((r) => (
                  <li
                    key={r.id}
                    className="border-b border-border pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
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
                <MessageSquare className="h-9 w-9 text-muted-foreground" />
                <h3 className="mt-3 font-semibold">No reviews yet</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Built this project? Share your experience and help the next
                  builder.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT — sticky sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-5">
            {/* Buy Complete Kit OR Buy Components Separately */}
            {kitProduct ? (
              <KitCard project={project} kitProduct={kitProduct} />
            ) : (
              <Card className="gap-0 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Wrench className="h-4 w-4 text-primary" />
                  Buy Components Separately
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  No pre-bundled kit for this project. Shop individual parts
                  from our catalog.
                </p>
                <Button asChild size="sm" className="mt-4 w-full">
                  <Link href="/products">
                    <Package className="h-4 w-4" /> Browse components
                  </Link>
                </Button>
              </Card>
            )}

            {/* Required Components */}
            <Card className="gap-0 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Cpu className="h-4 w-4 text-primary" />
                  Required Components
                </div>
                <span className="text-xs text-muted-foreground">
                  {project.requiredComponents.length} items
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {project.requiredComponents.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-foreground">{c}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="mt-4 w-full justify-between"
              >
                <Link href="/products">
                  Find in store <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </Card>

            {/* Resources (sidebar) */}
            {resourceLinks.length > 0 && (
              <Card className="gap-0 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="h-4 w-4 text-primary" />
                  Resources
                </div>
                <ul className="mt-3 space-y-1">
                  {resourceLinks.map((r) => (
                    <li key={r.label}>
                      <a
                        href={r.href as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
                      >
                        <span className="flex items-center gap-2 text-foreground">
                          <r.icon className="h-4 w-4 text-muted-foreground" />
                          {r.label}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Related Course */}
            <Card className="gap-0 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <GraduationCap className="h-4 w-4 text-primary" />
                Related Course
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Deepen your skills with a structured course that complements
                this build.
              </p>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="mt-4 w-full justify-between"
              >
                <Link href={relatedCourse.href}>
                  {relatedCourse.label}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </Card>
          </div>
        </aside>
      </div>

      {/* More Projects */}
      {moreProjects.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Keep building
              </div>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                More projects
              </h2>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/projects">
                <FolderGit2 className="h-4 w-4" />
                Browse all
              </Link>
            </Button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {moreProjects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ----------------------------- Sidebar cards ----------------------------- */

function KitCard({
  project,
  kitProduct,
}: {
  project: ProjectParsed;
  kitProduct: ProductWithCategory;
}) {
  const kitImage =
    kitProduct.images[0] ||
    "https://picsum.photos/seed/kit-placeholder/400/400";

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={kitImage}
          alt={kitProduct.name}
          fill
          sizes="320px"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
          Complete Kit
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ShoppingCart className="h-4 w-4 text-primary" />
          Buy Complete Kit
        </div>
        <Link
          href={`/products/${kitProduct.slug}`}
          className="mt-2 block text-sm font-medium leading-tight hover:text-primary hover:underline"
        >
          {kitProduct.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {kitProduct.shortDesc}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xl font-bold">
            ${kitProduct.price.toFixed(2)}
          </span>
          {kitProduct.compareAt && (
            <span className="text-sm text-muted-foreground line-through">
              ${kitProduct.compareAt.toFixed(2)}
            </span>
          )}
        </div>
        <div className="mt-4">
          <KitBuy
            slug={kitProduct.slug}
            name={kitProduct.name}
            price={kitProduct.price}
            image={kitImage}
            stock={kitProduct.stock}
          />
        </div>
      </div>
    </Card>
  );
}
