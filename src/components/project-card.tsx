import Link from "next/link";
import Image from "next/image";
import { Clock, BarChart3, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: {
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
  className?: string;
}

const difficultyVariant: Record<string, string> = {
  Beginner: "bg-success text-success-foreground",
  Intermediate: "bg-warning text-warning-foreground",
  Advanced: "bg-destructive text-destructive-foreground",
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <Card
        className={cn(
          "flex h-full flex-col overflow-hidden p-0 transition-shadow hover:shadow-md",
          className
        )}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex gap-1.5">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                difficultyVariant[project.difficulty] || "bg-secondary text-secondary-foreground"
              )}
            >
              {project.difficulty}
            </span>
            {project.category && (
              <span className="rounded-full bg-background/85 px-2.5 py-0.5 text-xs font-medium backdrop-blur">
                {project.category}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-semibold leading-tight group-hover:text-primary">
            {project.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{project.overview}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {project.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              {project.difficulty}
            </span>
          </div>
          <div className="mt-3">
            <StarRating rating={project.rating} showValue count={project.reviewCount} />
          </div>
          <div className="mt-auto flex items-center gap-1 pt-3 text-sm font-medium text-primary">
            View project <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
