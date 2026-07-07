"use client";

import * as React from "react";
import {
  Search,
  FileCode2,
  CircuitBoard,
  FileText,
  BookOpen,
  Presentation,
  Library,
  Cpu,
  Download,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DownloadLite = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize: string;
  fileUrl: string;
  thumbnail: string | null;
  downloads: number;
};

interface DownloadsViewProps {
  downloads: DownloadLite[];
}

const CATEGORIES = [
  "All",
  "Source Code",
  "PCB",
  "Datasheet",
  "Manual",
  "Slides",
  "Library",
  "Firmware",
] as const;
type Category = (typeof CATEGORIES)[number];

// Color-coded icon + badge per category (semantic tokens only).
const categoryMeta: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; tone: string; badge: string }
> = {
  "Source Code": {
    icon: FileCode2,
    tone: "bg-primary/10 text-primary",
    badge: "bg-primary/10 text-primary",
  },
  PCB: {
    icon: CircuitBoard,
    tone: "bg-success/15 text-success",
    badge: "bg-success/15 text-success",
  },
  Datasheet: {
    icon: FileText,
    tone: "bg-info/15 text-info",
    badge: "bg-info/15 text-info",
  },
  Manual: {
    icon: BookOpen,
    tone: "bg-warning/15 text-warning",
    badge: "bg-warning/15 text-warning",
  },
  Slides: {
    icon: Presentation,
    tone: "bg-danger/15 text-danger",
    badge: "bg-danger/15 text-danger",
  },
  Library: {
    icon: Library,
    tone: "bg-primary/10 text-primary",
    badge: "bg-primary/10 text-primary",
  },
  Firmware: {
    icon: Cpu,
    tone: "bg-success/15 text-success",
    badge: "bg-success/15 text-success",
  },
};

const fallbackMeta = {
  icon: FileText,
  tone: "bg-muted text-muted-foreground",
  badge: "bg-muted text-muted-foreground",
};

export function DownloadsView({ downloads }: DownloadsViewProps) {
  const [category, setCategory] = React.useState<Category>("All");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    let list = downloads.slice();
    if (category !== "All") {
      list = list.filter((d) => d.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.fileType.toLowerCase().includes(q)
      );
    }
    return list;
  }, [downloads, category, query]);

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
            Category
          </span>
          <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
            {CATEGORIES.map((c) => (
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
            placeholder="Search downloads…"
            aria-label="Search downloads"
            className="pl-8"
          />
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "file" : "files"}
        {category !== "All" && (
          <>
            {" "}
            in <span className="font-medium text-foreground">{category}</span>
          </>
        )}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <DownloadCard key={d.id} download={d} />
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

function DownloadCard({ download }: { download: DownloadLite }) {
  const meta = categoryMeta[download.category] ?? fallbackMeta;
  const Icon = meta.icon;

  return (
    <Card className="flex h-full flex-col gap-0 p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-lg",
            meta.tone
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-semibold leading-tight">
            {download.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 font-medium uppercase",
                meta.badge
              )}
            >
              {download.fileType}
            </span>
            <span>·</span>
            <span>{download.fileSize}</span>
          </div>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
        {download.description}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <Badge variant="secondary">{download.category}</Badge>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Download className="h-3.5 w-3.5" />
          {download.downloads.toLocaleString()}{" "}
          {download.downloads === 1 ? "download" : "downloads"}
        </span>
      </div>

      <div className="mt-auto pt-4">
        <Button asChild className="w-full">
          <a
            href={download.fileUrl}
            target="_blank"
            rel="noreferrer"
            download
          >
            <Download className="h-4 w-4" />
            Download
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </a>
        </Button>
      </div>
    </Card>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <FileText className="h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No downloads found</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try a different category, clear your search, or browse all available
        files.
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
