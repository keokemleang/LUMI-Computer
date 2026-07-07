import Link from "next/link";
import { ArrowRight, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/lib/data";

type ProjectLite = {
  id: string;
  slug: string;
  title: string;
  overview: string;
  difficulty: string;
  estimatedTime: string;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string | null;
};

export default async function MyProjectsPage() {
  const all = await getProjects();
  const mine = all.slice(0, 3).map<ProjectLite>((p) => ({
    id: p.id,
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
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Projects</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Projects you&apos;ve saved, started, or completed.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/projects">
            Explore more projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      {mine.length === 0 ? (
        <Card className="p-0">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
              <FolderGit2 className="h-8 w-8" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Browse our project library to find step-by-step builds with code,
              wiring, and docs.
            </p>
            <Button asChild className="mt-5">
              <Link href="/projects">Explore projects</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
