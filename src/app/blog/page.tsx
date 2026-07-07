import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  ArrowRight,
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
import { Card } from "@/components/ui/card";
import { getBlogPosts, parseJson } from "@/lib/data";
import { BlogView } from "./blog-view";

export const metadata: Metadata = {
  title: "Blog & Tutorials",
  description:
    "Tutorials, guides, and articles on Arduino, ESP32, STM32, PCB design, and embedded engineering.",
};

// Plain serializable shape for the client view.
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

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const lite: BlogLite[] = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    cover: p.cover,
    author: p.author,
    category: p.category,
    tags: parseJson<string[]>(p.tags, []),
    readTime: p.readTime,
    createdAt: p.createdAt.toISOString(),
  }));

  const [featured, ...rest] = lite;

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
            <BreadcrumbPage>Blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Blog &amp; Tutorials
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Guides, comparisons, and engineering notes from the KBSCircuit team.
        </p>
      </header>

      {/* Featured hero */}
      {featured && (
        <section className="mt-8">
          <Link href={`/blog/${featured.slug}`} className="group block">
            <Card className="grid gap-0 overflow-hidden p-0 transition-shadow hover:shadow-lg md:grid-cols-2">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted md:aspect-auto">
                {featured.cover ? (
                  <Image
                    src={featured.cover}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                <span className="absolute left-4 top-4">
                  <Badge className="bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                </span>
              </div>
              <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
                <Badge variant="secondary" className="w-fit">
                  {featured.category}
                </Badge>
                <h2 className="text-2xl font-bold leading-tight group-hover:text-primary md:text-3xl">
                  {featured.title}
                </h2>
                <p className="text-muted-foreground">{featured.excerpt}</p>
                <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {featured.author}
                  </span>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {featured.readTime}
                  </span>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Card>
          </Link>
        </section>
      )}

      {/* Remaining grid with filters */}
      <div className="mt-10">
        <BlogView posts={rest} />
      </div>
    </div>
  );
}
