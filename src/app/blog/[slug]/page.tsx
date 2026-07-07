import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  CalendarDays,
  ChevronRight,
  ChevronLeft,
  Mail,
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  ArrowRight,
  MessageSquare,
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
import { getBlogPosts, getBlogPostBySlug, parseJson } from "@/lib/data";
import { Markdown } from "./markdown";
import { NewsletterSignup } from "./newsletter-signup";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return { title: "Article not found" };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover ? [{ url: post.cover }] : undefined,
      type: "article",
    },
  };
}

// Derive initials from author name (e.g. "David Chen" → "DC").
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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const allPosts = await getBlogPosts();
  const tags = parseJson<string[]>(post.tags, []);

  // Related posts — same category, excluding current, up to 3.
  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  // Prev/next in chronological order (oldest first → next is the newer post).
  const ordered = [...allPosts].reverse();
  const currentIndex = ordered.findIndex((p) => p.slug === post.slug);
  const prev = currentIndex > 0 ? ordered[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < ordered.length - 1
      ? ordered[currentIndex + 1]
      : null;

  const publishedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
              <Link href="/blog">Blog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Article column */}
        <article className="min-w-0">
          {/* Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{post.category}</Badge>
              {tags.slice(0, 4).map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold ${avatarColor(
                    post.author
                  )}`}
                >
                  {initials(post.author)}
                </span>
                <span className="font-medium text-foreground">{post.author}</span>
              </span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {publishedDate}
              </span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </header>

          {/* Cover */}
          {post.cover && (
            <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 720px"
                className="object-cover"
              />
            </div>
          )}

          {/* Body */}
          <div className="mt-8">
            <Markdown content={post.content} />
          </div>

          {/* Tags footer */}
          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tags
              </span>
              {tags.map((t) => (
                <Badge key={t} variant="secondary">
                  #{t}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="my-8" />

          {/* Author bio */}
          <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <span
              className={`grid h-16 w-16 shrink-0 place-items-center rounded-full text-xl font-semibold ${avatarColor(
                post.author
              )}`}
            >
              {initials(post.author)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Written by
              </div>
              <h3 className="mt-1 text-lg font-semibold">{post.author}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Engineer at KBSCircuit. Writes about embedded systems, IoT, and
                the craft of teaching electronics. Shares tutorials, project
                breakdowns, and field notes from the workshop.
              </p>
            </div>
          </Card>

          {/* Prev / Next */}
          {(prev || next) && (
            <nav
              aria-label="Continue reading"
              className="mt-6 grid gap-4 sm:grid-cols-2"
            >
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="group rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                  </div>
                  <div className="mt-1 line-clamp-2 font-medium group-hover:text-primary">
                    {prev.title}
                  </div>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group rounded-lg border border-border p-4 text-right transition-colors hover:bg-accent"
                >
                  <div className="flex items-center justify-end gap-1 text-xs font-medium text-muted-foreground">
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                  <div className="mt-1 line-clamp-2 font-medium group-hover:text-primary">
                    {next.title}
                  </div>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-6">
            {/* Share */}
            <Card className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Share this article
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2">
                <ShareButton icon={Twitter} label="Share on Twitter" />
                <ShareButton icon={Facebook} label="Share on Facebook" />
                <ShareButton icon={Linkedin} label="Share on LinkedIn" />
                <ShareButton icon={Mail} label="Share by email" />
                <ShareButton icon={Link2} label="Copy link" />
              </div>
            </Card>

            {/* Newsletter */}
            <Card className="p-5">
              <NewsletterSignup />
            </Card>

            {/* Related */}
            {related.length > 0 && (
              <Card className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Related articles
                </div>
                <ul className="mt-3 space-y-3">
                  {related.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={`/blog/${r.slug}`}
                        className="group flex items-start gap-3 rounded-md p-1 transition-colors hover:bg-accent"
                      >
                        {r.cover ? (
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                            <Image
                              src={r.cover}
                              alt={r.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="grid h-12 w-16 shrink-0 place-items-center rounded-md bg-muted">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="line-clamp-2 text-sm font-medium leading-tight group-hover:text-primary">
                            {r.title}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {r.readTime}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Browse all */}
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/blog">
                All articles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ShareButton({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="grid h-10 w-full place-items-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
