import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  FolderGit2,
  MessageSquare,
  MessageCircle,
  ArrowRight,
  Trophy,
  Star,
  Activity,
  Sparkles,
  ChevronRight,
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
import { getFeaturedProjects, type ProjectParsed } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the KBSCircuit community. Share projects, ask questions, and learn from thousands of engineers and makers.",
};

// Derive initials from author name.
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

// Mock discussion threads.
const DISCUSSIONS = [
  {
    id: "d1",
    title: "Best way to debounce a rotary encoder on ESP32?",
    author: "Marco P.",
    category: "ESP32",
    replies: 14,
    views: 312,
    lastActivity: "2h ago",
    pinned: false,
  },
  {
    id: "d2",
    title: "STM32 HAL vs Low-Layer — what do you actually use?",
    author: "Priya S.",
    category: "STM32",
    replies: 27,
    views: 640,
    lastActivity: "5h ago",
    pinned: true,
  },
  {
    id: "d3",
    title: "Show & tell: my DIY weather station is live!",
    author: "Tom W.",
    category: "Showcase",
    replies: 9,
    views: 178,
    lastActivity: "1d ago",
    pinned: false,
  },
  {
    id: "d4",
    title: "KiCad 8 — any tips for hierarchical sheets?",
    author: "Lina P.",
    category: "PCB Design",
    replies: 6,
    views: 121,
    lastActivity: "1d ago",
    pinned: false,
  },
  {
    id: "d5",
    title: "LiPo charging IC recommendations for portable Pi build",
    author: "Amir R.",
    category: "Power",
    replies: 11,
    views: 244,
    lastActivity: "2d ago",
    pinned: false,
  },
  {
    id: "d6",
    title: "MQTT vs HTTP for home automation — performance test",
    author: "Grace H.",
    category: "IoT",
    replies: 18,
    views: 489,
    lastActivity: "3d ago",
    pinned: false,
  },
];

// Mock top contributors.
const CONTRIBUTORS = [
  { name: "David Chen", role: "Maintainer", contributions: 482, badge: "Founder" },
  { name: "Aisha Rahman", role: "IoT Expert", contributions: 391, badge: "Top Author" },
  { name: "Michael Torres", role: "PCB Mentor", contributions: 318, badge: "Mentor" },
  { name: "Liam O'Brien", role: "Embedded Dev", contributions: 264, badge: "Helper" },
  { name: "Priya S.", role: "Maker", contributions: 207, badge: "Rising Star" },
];

export default async function CommunityPage() {
  const featuredProjects = await getFeaturedProjects();
  const showcase: Pick<
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
  >[] = featuredProjects.slice(0, 3).map((p) => ({
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

  const stats = [
    { label: "Members", value: "18k+", icon: Users },
    { label: "Projects shared", value: "4.2k+", icon: FolderGit2 },
    { label: "Questions answered", value: "12k+", icon: MessageCircle },
  ];

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
            <BreadcrumbPage>Community</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-10">
        <div className="max-w-2xl space-y-4">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Community
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Join the KBSCircuit community
          </h1>
          <p className="text-lg text-muted-foreground">
            Thousands of engineers, makers, and students share projects, answer
            questions, and learn together. Be part of the build.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link href="/support">
                <MessageSquare className="h-4 w-4" />
                Start a discussion
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/projects">
                <FolderGit2 className="h-4 w-4" />
                Share a project
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-2xl font-bold leading-none">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          </Card>
        ))}
      </section>

      {/* Tabs of community activity */}
      <section className="mt-10">
        <Tabs defaultValue="discussions" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="discussions">
              <MessageSquare className="h-4 w-4" />
              Recent Discussions
            </TabsTrigger>
            <TabsTrigger value="projects">
              <FolderGit2 className="h-4 w-4" />
              Project Showcase
            </TabsTrigger>
            <TabsTrigger value="contributors">
              <Trophy className="h-4 w-4" />
              Top Contributors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="mt-6">
            <Card className="divide-y divide-border p-0">
              {DISCUSSIONS.map((d) => (
                <div
                  key={d.id}
                  className="flex items-start gap-4 p-4 transition-colors hover:bg-accent/40 sm:p-5"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    {initials(d.author)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {d.pinned && (
                        <Badge variant="default" className="gap-1">
                          <Star className="h-3 w-3" />
                          Pinned
                        </Badge>
                      )}
                      <Badge variant="secondary">{d.category}</Badge>
                    </div>
                    <h3 className="mt-1.5 font-semibold leading-tight hover:text-primary">
                      <Link href="/support">{d.title}</Link>
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        Started by{" "}
                        <span className="font-medium text-foreground">
                          {d.author}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {d.replies} replies
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Activity className="h-3.5 w-3.5" />
                        {d.views} views
                      </span>
                      <span>· last activity {d.lastActivity}</span>
                    </div>
                  </div>
                  <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
                </div>
              ))}
            </Card>
            <div className="mt-4 flex justify-center">
              <Button asChild variant="outline" size="sm">
                <Link href="/support">
                  Browse all discussions
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            {showcase.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {showcase.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            ) : (
              <Card className="p-10 text-center text-sm text-muted-foreground">
                No featured projects yet.
              </Card>
            )}
            <div className="mt-6 flex justify-center">
              <Button asChild variant="outline" size="sm">
                <Link href="/projects">
                  Explore all projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="contributors" className="mt-6">
            <Card className="divide-y divide-border p-0">
              {CONTRIBUTORS.map((c, i) => (
                <div
                  key={c.name}
                  className="flex items-center gap-4 p-4 sm:p-5"
                >
                  <span className="w-5 text-center text-sm font-semibold text-muted-foreground">
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-semibold",
                      avatarColor(c.name)
                    )}
                  >
                    {initials(c.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{c.name}</span>
                      <Badge variant="outline" className="gap-1">
                        <Trophy className="h-3 w-3 text-warning" />
                        {c.badge}
                      </Badge>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {c.role}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {c.contributions}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      contributions
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Separator className="my-10" />

      {/* CTA */}
      <section>
        <Card className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Ready to share your project?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Show off your build, get feedback, and inspire the next maker.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/contact">
                <FolderGit2 className="h-4 w-4" />
                Submit a project
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/support">Get help</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
