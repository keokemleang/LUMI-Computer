"use client";

import * as React from "react";
import { Search, GraduationCap } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CourseLite {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  difficulty: string;
  duration: string;
  lessonsCount: number;
  price: number;
  rating: number;
  reviewCount: number;
}

interface CoursesViewProps {
  courses: CourseLite[];
}

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

const PRICES = ["All", "Free", "Paid"] as const;
type PriceFilter = (typeof PRICES)[number];

const difficultyActiveClass: Record<Difficulty, string> = {
  All: "bg-primary text-primary-foreground hover:bg-primary/90",
  Beginner: "bg-success text-success-foreground hover:bg-success/90",
  Intermediate: "bg-warning text-warning-foreground hover:bg-warning/90",
  Advanced: "bg-danger text-danger-foreground hover:bg-danger/90",
};

export function CoursesView({ courses }: CoursesViewProps) {
  const [difficulty, setDifficulty] = React.useState<Difficulty>("All");
  const [price, setPrice] = React.useState<PriceFilter>("All");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    let list = courses.slice();
    if (difficulty !== "All") {
      list = list.filter((c) => c.difficulty === difficulty);
    }
    if (price !== "All") {
      if (price === "Free") {
        list = list.filter((c) => c.price === 0);
      } else {
        list = list.filter((c) => c.price > 0);
      }
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [courses, difficulty, price, query]);

  const resetFilters = React.useCallback(() => {
    setDifficulty("All");
    setPrice("All");
    setQuery("");
  }, []);

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

        {/* Price + search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:sr-only">
              Price
            </span>
            <div className="inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1">
              {PRICES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrice(p)}
                  aria-pressed={price === p}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    price === p
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-background hover:text-foreground"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses…"
              aria-label="Search courses"
              className="pl-8 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "course" : "courses"}
        {difficulty !== "All" && (
          <>
            {" "}
            in{" "}
            <span className="font-medium text-foreground">{difficulty}</span>
          </>
        )}
        {price !== "All" && (
          <>
            {" · "}
            <span className="font-medium text-foreground">{price}</span>
          </>
        )}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      ) : (
        <EmptyState onReset={resetFilters} />
      )}

      {/* Reset helper — only shown when filters are applied and there are results */}
      {filtered.length > 0 &&
        (difficulty !== "All" || price !== "All" || query.trim()) && (
          <div className="flex justify-center pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
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
      <GraduationCap className="h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try a different difficulty or price filter, clear your search, or browse
        all available courses.
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
