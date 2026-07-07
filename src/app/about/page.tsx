import type { Metadata } from "next";
import Link from "next/link";
import {
  Hammer,
  BookOpen,
  BadgeCheck,
  Users,
  Globe2,
  Cpu,
  ArrowRight,
  Sparkles,
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
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "KBSCircuit is the engineering learning platform we wished we had. Learn, build, and share electronics projects with a global community.",
};

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

const STATS = [
  { label: "Students learning", value: "120k+", icon: Users },
  { label: "Countries reached", value: "60+", icon: Globe2 },
  { label: "Projects built", value: "4.2k+", icon: Cpu },
];

const VALUES = [
  {
    icon: Hammer,
    title: "Learn by doing",
    description:
      "Theory is good — building is better. Every course ships with hands-on labs and a real project you keep.",
  },
  {
    icon: BookOpen,
    title: "Open knowledge",
    description:
      "Schematics, source code, and datasheets are free to download. Knowledge scales when it's shared.",
  },
  {
    icon: BadgeCheck,
    title: "Quality first",
    description:
      "We stock only vetted boards and curate every kit. If we wouldn't use it ourselves, we won't sell it.",
  },
  {
    icon: Users,
    title: "Community-driven",
    description:
      "Thousands of makers answer questions, share builds, and push the platform forward every week.",
  },
];

const TEAM = [
  {
    name: "David Chen",
    role: "Founder & Lead Engineer",
    bio: "Embedded systems engineer with 12+ years building consumer IoT. Started KBSCircuit to fix the gap between tutorials and real projects.",
  },
  {
    name: "Aisha Rahman",
    role: "IoT Curriculum Lead",
    bio: "Former Espressif developer advocate. Designs the ESP32 bootcamp and writes most of the MQTT & connectivity tutorials.",
  },
  {
    name: "Michael Torres",
    role: "PCB Design Instructor",
    bio: "Senior hardware engineer turned educator. Has taped out 40+ boards and teaches KiCad like nobody else.",
  },
  {
    name: "Liam O'Brien",
    role: "Firmware & Tooling",
    bio: "Maintains our STM32 HAL helper library and the embedded C curriculum. Lives inside a debugger.",
  },
];

export default function AboutPage() {
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
            <BreadcrumbPage>About</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero */}
      <section className="mt-8 max-w-3xl space-y-4">
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3.5 w-3.5" />
          Our mission
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          We&apos;re building the engineering learning platform we wished we
          had.
        </h1>
        <p className="text-lg text-muted-foreground">
          KBSCircuit brings together the components, kits, courses, and
          community engineers need to go from idea to working prototype — all
          in one place, taught by people who actually ship hardware.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild>
            <Link href="/products">
              Shop components
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/courses">Explore courses</Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {STATS.map((s) => (
          <Card key={s.label} className="flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-2xl font-bold leading-none">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {s.label}
              </div>
            </div>
          </Card>
        ))}
      </section>

      <Separator className="my-12" />

      {/* Our story */}
      <section className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Our story
          </h2>
          <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              KBSCircuit started in a small workshop with a simple frustration:
              learning electronics meant jumping between five different
              websites, two forums, and a stack of incomplete datasheets. We
              wanted one place where a beginner could buy a board, follow a
              project, and ask a question — and actually finish what they
              started.
            </p>
            <p>
              So we built it. Today KBSCircuit combines a vetted component
              catalog, project kits with wiring diagrams and code, project-based
              online courses taught by working engineers, and a community where
              thousands of makers help each other ship real hardware. Every
              product we sell is something we&apos;ve used ourselves. Every
              course is built around a project you keep.
            </p>
            <p>
              Our mission is simple: make engineering education hands-on,
              honest, and open. We believe anyone who wants to build should have
              the tools, the docs, and the people to make it real — without
              gatekeeping, without fluff, and without giving up at the first
              error message.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card className="p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              At a glance
            </div>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Founded</dt>
                <dd className="font-medium">2021</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Headquarters</dt>
                <dd className="font-medium">Remote-first</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Team</dt>
                <dd className="font-medium">12 engineers &amp; educators</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Open-source repos</dt>
                <dd className="font-medium">40+</dd>
              </div>
            </dl>
            <Button asChild variant="outline" className="mt-5 w-full justify-between">
              <Link href="/community">
                Join the community
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </aside>
      </section>

      {/* Values */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          What we believe
        </h2>
        <p className="mt-1 text-muted-foreground">
          Four principles that shape every product, course, and decision we
          make.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <Card key={v.title} className="flex flex-col gap-3 p-5">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <v.icon className="h-5 w-5" />
              </span>
              <h3 className="font-semibold">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Meet the team
        </h2>
        <p className="mt-1 text-muted-foreground">
          Working engineers who teach what they ship.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <Card key={m.name} className="flex flex-col items-center p-6 text-center">
              <span
                className={cn(
                  "grid h-16 w-16 place-items-center rounded-full text-xl font-semibold",
                  avatarColor(m.name)
                )}
              >
                {initials(m.name)}
              </span>
              <h3 className="mt-3 font-semibold">{m.name}</h3>
              <p className="text-xs font-medium text-primary">{m.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16">
        <Card className="flex flex-col items-start gap-4 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Start building today
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Grab a kit, enroll in a course, and ship your first project this
              weekend.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/products">
                Shop products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/courses">Browse courses</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
