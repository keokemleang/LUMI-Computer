"use client";

import * as React from "react";
import { Search, FolderGit2 } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ProjectLite {
  slug: string;
  title: string;
  overview: string;
  difficulty: string;
  estimatedTime: string;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string | null;
}

interface ProjectsViewProps {
  projects: ProjectLite[];
}

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

const difficultyActiveClass: Record<Difficulty, string> = {
  All: "bg-primary text-primary-foreground hover:bg-primary/90",
  Beginner:
    "bg-success text-success-foreground hover:bg-success/90",
  Intermediate:
    "bg-warning text-warning-foreground hover:bg-warning/90",
  Advanced: "bg-danger text-danger-foreground hover:bg-danger/90",
};

export function ProjectsView({ projects }: ProjectsViewProps) {
  const [difficulty, setDifficulty] = React.useState<Difficulty>("All");
  const [category, setCategory] = React.useState<string>("all");
  const [query, setQuery] = React.useState("");

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [projects]);

  const filtered = React.useMemo(() => {
    let list = projects.slice();
    if (difficulty !== "All") {
      list = list.filter((p) => p.difficulty === difficulty);
    }
    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.overview.toLowerCase().includes(q)
      );
    }
    return list;
  }, [projects, difficulty, category, query]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        {/* Difficulty button group */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Difficulty
          </span>
          <div className="inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                aria-pressed={difficulty === d}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  difficulty === d
                    ? difficultyActiveClass[d]
                    : "text-muted-foreground hover:bg-background hover:text-foreground"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Category + search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:sr-only">
              Category
            </span>
            <Select value={category} onValueChange={(v) => setCategory(v)}>
              <SelectTrigger
                className="w-full sm:w-52"
                aria-label="Filter by category"
              >
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              aria-label="Search projects"
              className="pl-8 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "project" : "projects"}
        {difficulty !== "All" && (
          <>
            {" "}
            in{" "}
            <span className="font-medium text-foreground">{difficulty}</span>
          </>
        )}
        {category !== "all" && (
          <>
            {" "}
            under{" "}
            <span className="font-medium text-foreground">{category}</span>
          </>
        )}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          onReset={() => {
            setDifficulty("All");
            setCategory("all");
            setQuery("");
          }}
        />
      )}

      {/* Reset helper — only shown when filters are applied and there are results */}
      {filtered.length > 0 &&
        (difficulty !== "All" || category !== "all" || query.trim()) && (
          <div className="flex justify-center pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setDifficulty("All");
                setCategory("all");
                setQuery("");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <FolderGit2 className="h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try a different difficulty or category, clear your search, or browse all
        projects.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={onReset}
      >
        Clear filters
      </Button>
    </div>
  );
}
