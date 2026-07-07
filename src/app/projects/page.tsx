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
import { getProjects, type ProjectParsed } from "@/lib/data";
import { ProjectsView } from "./projects-view";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse hands-on electronics projects with code, wiring diagrams, PCB files, and documentation. Build something real with KBSCircuit.",
};

// Pass only the fields the view + ProjectCard need (and that are safely
// serializable across the server→client boundary).
type ProjectLite = Pick<
  ProjectParsed,
  | "slug"
  | "title"
  | "overview"
  | "difficulty"
  | "estimatedTime"
  | "images"
  | "rating"
  | "reviewCount"
  | "category"
>;

export default async function ProjectsPage() {
  const projects = await getProjects();
  const initial: ProjectLite[] = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    overview: p.overview,
    difficulty: p.difficulty,
    estimatedTime: p.estimatedTime,
    images: p.images,
    rating: p.rating,
    reviewCount: p.reviewCount,
    category: p.category,
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
            <BreadcrumbPage>Projects</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Build something real. Each project includes code, wiring, and docs.
        </p>
      </header>

      <div className="mt-8">
        <ProjectsView projects={initial} />
      </div>
    </div>
  );
}
