import Link from "next/link";
import { Hammer, BadgeCheck, Users, Globe2, Cpu, ArrowRight, Sparkles, Truck } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
export const metadata = {
  title: "About",
  description: "LUMI Computer sells desktop computer parts and laptops, vetted and stocked by people who build their own rigs."
};
function initials(name) {
  const parts = name.split(/\s+/).filter(p => p.length > 0 && !/^(dr|eng|prof|mr|mrs|ms)\.?$/i.test(p));
  const picked = parts.length >= 2 ? parts.slice(-2) : parts;
  if (picked.length === 0) return name.charAt(0).toUpperCase() || "?";
  return picked.map(p => p.charAt(0).toUpperCase()).join("").slice(0, 2);
}
const AVATAR_PALETTE = ["bg-primary/15 text-primary", "bg-success/15 text-success", "bg-warning/15 text-warning", "bg-danger/15 text-danger"];
function avatarColor(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = h * 31 + seed.charCodeAt(i) | 0;
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}
const STATS = [{
  label: "Orders shipped",
  value: "80k+",
  icon: Truck
}, {
  label: "Countries reached",
  value: "40+",
  icon: Globe2
}, {
  label: "Parts in catalog",
  value: "200+",
  icon: Cpu
}];
const VALUES = [{
  icon: BadgeCheck,
  title: "Quality first",
  description: "We stock only parts we'd put in our own machines. Every listing has the specs that actually matter."
}, {
  icon: Hammer,
  title: "Built by builders",
  description: "Our team benches, upgrades, and troubleshoots PCs daily — support that knows the difference between a B650 and an X670."
}, {
  icon: Truck,
  title: "Real stock, fast shipping",
  description: "No ghost inventory. What you see in stock is what we can ship today."
}, {
  icon: Users,
  title: "Straight answers",
  description: "Compatibility questions, RMA help, and upgrade advice from people who know hardware."
}];
const TEAM = [{
  name: "David Chen",
  role: "Founder",
  bio: "Started LUMI Computer after years of building PCs for friends and getting tired of guessing whether parts actually fit."
}, {
  name: "Aisha Rahman",
  role: "Product & Sourcing",
  bio: "Vets every SKU before it hits the catalog and keeps stock counts honest."
}, {
  name: "Michael Torres",
  role: "Hardware Support Lead",
  bio: "Answers compatibility and RMA questions — sockets, wattage, and clearance, all day."
}, {
  name: "Liam O'Brien",
  role: "Operations",
  bio: "Keeps orders moving from warehouse to doorstep, fast."
}];
export default function AboutPage() {
  return <div className="container-page py-8 md:py-10">
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
          Computer parts and laptops, from people who actually build PCs.
        </h1>
        <p className="text-lg text-muted-foreground">
          LUMI Computer stocks CPUs, GPUs, motherboards, memory, storage, and laptops — vetted,
          in-stock, and shipped fast. No guesswork on compatibility.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild>
            <Link href="/products">
              Shop products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/categories/laptops">Shop laptops</Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {STATS.map(s => <Card key={s.label} className="flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-2xl font-bold leading-none">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {s.label}
              </div>
            </div>
          </Card>)}
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
              LUMI Computer started because building a PC shouldn't mean gambling on whether a
              listing's specs are actually accurate. We wanted a shop where the socket, chipset,
              wattage, and clearance were always right there — and the stock count meant something.
            </p>
            <p>
              Today we carry desktop CPUs and GPUs, motherboards, memory, storage, power supplies,
              cases, cooling, and complete laptops. Every product we sell is something we'd put in
              our own rigs, and every stock number is real.
            </p>
            <p>
              Our mission is simple: make buying computer hardware straightforward, honest, and
              fast — with real people behind it when you have a compatibility question.
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
                <dd className="font-medium">12 people</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Categories</dt>
                <dd className="font-medium">10+</dd>
              </div>
            </dl>
            <Button asChild variant="outline" className="mt-5 w-full justify-between">
              <Link href="/support">
                Contact support
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
          Four principles that shape every product and decision we make.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(v => <Card key={v.title} className="flex flex-col gap-3 p-5">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <v.icon className="h-5 w-5" />
              </span>
              <h3 className="font-semibold">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.description}</p>
            </Card>)}
        </div>
      </section>

      {/* Team */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Meet the team
        </h2>
        <p className="mt-1 text-muted-foreground">
          Builders and upgraders who know the parts they sell.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map(m => <Card key={m.name} className="flex flex-col items-center p-6 text-center">
              <span className={cn("grid h-16 w-16 place-items-center rounded-full text-xl font-semibold", avatarColor(m.name))}>
                {initials(m.name)}
              </span>
              <h3 className="mt-3 font-semibold">{m.name}</h3>
              <p className="text-xs font-medium text-primary">{m.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
            </Card>)}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16">
        <Card className="flex flex-col items-start gap-4 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Ready to build?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse parts by category or shop laptops ready to ship today.
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
              <Link href="/categories">Browse categories</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>;
}
