"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Search, Newspaper } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type BlogLite = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string | null;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  createdAt: string;
};

interface BlogViewProps {
  posts: BlogLite[];
}

export function BlogView({ posts }: BlogViewProps) {
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [posts]);

  const [category, setCategory] = React.useState<string>("All");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    let list = posts.slice();
    if (category !== "All") {
      list = list.filter((p) => p.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [posts, category, query]);

  const resetFilters = React.useCallback(() => {
    setCategory("All");
    setQuery("");
  }, []);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Topic
          </span>
          <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  category === c
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-background hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="pl-8"
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "article" : "articles"}
        {category !== "All" && (
          <>
            {" "}
            in <span className="font-medium text-foreground">{category}</span>
          </>
        )}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <EmptyState onReset={resetFilters} />
      )}

      {filtered.length > 0 && (category !== "All" || query.trim()) && (
        <div className="flex justify-center pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

function BlogCard({ post }: { post: BlogLite }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden p-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {post.cover ? (
            <Image
              src={post.cover}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
          <Badge className="absolute left-3 top-3 bg-background/85 text-foreground backdrop-blur">
            {post.category}
          </Badge>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 font-semibold leading-tight group-hover:text-primary">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{post.author}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>
          <div className="mt-auto flex items-center gap-1 pt-4 text-sm font-medium text-primary">
            Read article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <Newspaper className="h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No articles found</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try a different topic, clear your search, or browse all articles.
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
