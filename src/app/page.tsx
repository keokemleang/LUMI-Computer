import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Cpu,
  GraduationCap,
  FolderGit2,
  FileDown,
  ShoppingCart,
  Wrench,
  Users,
  ShieldCheck,
  Truck,
  Zap,
  BookOpen,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { ProjectCard } from "@/components/project-card";
import { CourseCard } from "@/components/course-card";
import { StarRating } from "@/components/star-rating";
import {
  getFeaturedCategories,
  getFeaturedProducts,
  getFeaturedProjects,
  getFeaturedCourses,
  getBlogPosts,
} from "@/lib/data";

export default async function HomePage() {
  const [categories, products, projects, courses, posts] = await Promise.all([
    getFeaturedCategories(),
    getFeaturedProducts(),
    getFeaturedProjects(),
    getFeaturedCourses(),
    getBlogPosts(),
  ]);

  const latestTutorials = posts.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,var(--primary)/8%,transparent)]" />
        <div className="container-page grid gap-10 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Learn · Build · Experiment
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              The complete{" "}
              <span className="text-primary">engineering learning</span> platform
            </h1>
            <p className="mt-5 max-w-xl text-balance text-lg text-muted-foreground">
              Buy components, get complete project kits, follow video courses, download source
              code, PCB files, and documentation — everything you need to finish your project in
              one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/products">
                  Browse Components <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/projects">Explore Projects</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6 text-sm">
              <div>
                <div className="text-2xl font-bold">15+</div>
                <div className="text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold">120+</div>
                <div className="text-muted-foreground">Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold">40+</div>
                <div className="text-muted-foreground">Courses</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <div className="relative aspect-square">
                    <Image src="https://picsum.photos/seed/hero-esp32/600/600" alt="ESP32" fill className="object-cover" sizes="300px" />
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm">
                  <FolderGit2 className="h-8 w-8 text-success" />
                  <p className="mt-2 text-sm font-medium">Project Kits</p>
                  <p className="text-xs text-muted-foreground">Everything in one box</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm">
                  <GraduationCap className="h-8 w-8 text-warning" />
                  <p className="mt-2 text-sm font-medium">Video Courses</p>
                  <p className="text-xs text-muted-foreground">Learn by building</p>
                </div>
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <div className="relative aspect-square">
                    <Image src="https://picsum.photos/seed/hero-arduino/600/600" alt="Arduino" fill className="object-cover" sizes="300px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-muted/30">
        <div className="container-page grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, title: "Fast Shipping", desc: "Worldwide delivery" },
            { icon: ShieldCheck, title: "Quality Guaranteed", desc: "Tested components" },
            { icon: Wrench, title: "Technical Support", desc: "Engineers on call" },
            { icon: FileDown, title: "Free Resources", desc: "Code, PCB & docs" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="container-page py-16">
        <SectionHeader
          eyebrow="Browse"
          title="Popular Categories"
          desc="From microcontrollers to sensors — find the right parts for your build."
          href="/categories"
          linkLabel="All categories"
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.slug}`} className="group">
              <Card className="flex h-full flex-col items-center gap-3 p-5 text-center transition-shadow hover:shadow-md">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={cat.image || ""}
                    alt={cat.name}
                    fill
                    sizes="200px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold group-hover:text-primary">{cat.name}</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-y border-border bg-muted/20 py-16">
        <div className="container-page">
          <SectionHeader
            eyebrow="Shop"
            title="Featured Products"
            desc="Hand-picked components and kits loved by our community."
            href="/products"
            linkLabel="View all products"
          />
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Project Kits */}
      <section className="container-page py-16">
        <SectionHeader
          eyebrow="Build"
          title="Popular Project Kits"
          desc="Complete kits with all parts, code, and documentation included."
          href="/projects"
          linkLabel="All projects"
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="border-y border-border bg-muted/20 py-16">
        <div className="container-page">
          <SectionHeader
            eyebrow="Learn"
            title="Featured Courses"
            desc="Project-based video courses taught by working engineers."
            href="/courses"
            linkLabel="All courses"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Why KBSCircuit */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">Why KBSCircuit</Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight">
            Not just a store — a complete learning ecosystem
          </h2>
          <p className="mt-3 text-muted-foreground">
            We combine hardware, education, and community so you can go from idea to working
            project without juggling five different platforms.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShoppingCart, title: "Buy Hardware", desc: "Components, modules, and tools from trusted brands." },
            { icon: FolderGit2, title: "Get Project Kits", desc: "Complete kits with everything needed for a build." },
            { icon: GraduationCap, title: "Take Courses", desc: "Structured, project-based learning paths." },
            { icon: FileDown, title: "Download Resources", desc: "Source code, PCB files, datasheets, and docs." },
          ].map((f) => (
            <Card key={f.title} className="p-6">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Tutorials */}
      <section className="border-y border-border bg-muted/20 py-16">
        <div className="container-page">
          <SectionHeader
            eyebrow="Read"
            title="Latest Tutorials"
            desc="Guides and articles from our engineering team."
            href="/blog"
            linkLabel="All articles"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {latestTutorials.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <Card className="flex h-full flex-col overflow-hidden p-0 transition-shadow hover:shadow-md">
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <Image
                      src={post.cover || ""}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span>· {post.readTime} read</span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 font-semibold leading-tight group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                    <div className="mt-auto flex items-center gap-1 pt-4 text-sm font-medium text-primary">
                      Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="container-page py-16">
        <Card className="relative overflow-hidden p-8 md:p-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_80%_at_100%_0%,var(--primary)/10%,transparent)]" />
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-3 gap-1.5">
                <Users className="h-3.5 w-3.5" /> Community
              </Badge>
              <h2 className="text-balance text-3xl font-bold tracking-tight">
                Join thousands of makers building together
              </h2>
              <p className="mt-3 text-muted-foreground">
                Share your projects, ask questions, and learn from engineers and hobbyists
                around the world. Showcase your work and get feedback.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/community">Visit Community <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/support">Get Support</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, label: "Tutorials", value: "250+" },
                { icon: FolderGit2, label: "Projects", value: "120+" },
                { icon: Users, label: "Members", value: "18k+" },
                { icon: Star, label: "Avg. Rating", value: "4.8" },
              ].map((s) => (
                <Card key={s.label} className="flex items-center gap-3 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}

function SectionHeader({
  eyebrow,
  title,
  desc,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</div>
        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <p className="mt-2 text-muted-foreground">{desc}</p>
      </div>
      <Button asChild variant="outline" size="sm" className="shrink-0">
        <Link href={href}>
          {linkLabel} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
