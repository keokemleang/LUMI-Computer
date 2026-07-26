import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Cpu, MonitorSmartphone, ShieldCheck, Truck, Wrench, Zap, HardDrive, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { getFeaturedCategories, getFeaturedProducts } from "@/lib/data";
export default async function HomePage() {
  const [categories, products] = await Promise.all([getFeaturedCategories(), getFeaturedProducts()]);
  return <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,var(--primary)/8%,transparent)]" />
        <div className="container-page grid gap-8 py-10 sm:gap-10 sm:py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Build · Upgrade · Play
            </Badge>
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Build your rig with{" "}
              <span className="text-primary">parts you can trust</span>
            </h1>
            <p className="mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
              CPUs, GPUs, motherboards, memory, storage, and laptops from the brands you know.
              Fast shipping, real stock counts, and support that knows the difference between a
              B650 and an X670.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-11 sm:h-10">
                <Link href="/products">
                  Shop All Parts <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 sm:h-10">
                <Link href="/categories/laptops">Shop Laptops</Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6 text-sm sm:mt-10 sm:gap-6">
              <div>
                <div className="text-xl font-bold sm:text-2xl">10+</div>
                <div className="text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-xl font-bold sm:text-2xl">200+</div>
                <div className="text-muted-foreground">Parts in stock</div>
              </div>
              <div>
                <div className="text-xl font-bold sm:text-2xl">24/7</div>
                <div className="text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <div className="relative aspect-square">
                    <Image src="https://picsum.photos/seed/hero-gpu/600/600" alt="Graphics card" fill className="object-cover" sizes="300px" />
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm">
                  <Cpu className="h-8 w-8 text-primary" />
                  <p className="mt-2 text-sm font-medium">Latest CPUs</p>
                  <p className="text-xs text-muted-foreground">AMD &amp; Intel</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm">
                  <Laptop className="h-8 w-8 text-primary" />
                  <p className="mt-2 text-sm font-medium">Gaming Laptops</p>
                  <p className="text-xs text-muted-foreground">Ready to ship</p>
                </div>
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <div className="relative aspect-square">
                    <Image src="https://picsum.photos/seed/hero-laptop/600/600" alt="Laptop" fill className="object-cover" sizes="300px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-muted/30">
        <div className="container-page grid grid-cols-2 gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {[{
          icon: Truck,
          title: "Fast Shipping",
          desc: "Worldwide delivery"
        }, {
          icon: ShieldCheck,
          title: "Warranty Backed",
          desc: "Manufacturer coverage"
        }, {
          icon: Wrench,
          title: "Build Support",
          desc: "Compatibility checked"
        }, {
          icon: HardDrive,
          title: "Real Stock",
          desc: "No ghost inventory"
        }].map(f => <div key={f.title} className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            </div>)}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="container-page py-10 sm:py-16">
        <SectionHeader eyebrow="Browse" title="Shop by Category" desc="From CPUs to complete laptops — find the right part for your build." href="/categories" linkLabel="All categories" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map(cat => <Link key={cat.id} href={`/categories/${cat.slug}`} className="group">
              <Card className="flex h-full flex-col items-center gap-3 p-5 text-center transition-shadow hover:shadow-md">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                  <Image src={cat.image || ""} alt={cat.name} fill sizes="200px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div>
                  <div className="text-sm font-semibold group-hover:text-primary">{cat.name}</div>
                </div>
              </Card>
            </Link>)}
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-y border-border bg-muted/20 py-10 sm:py-16">
        <div className="container-page">
          <SectionHeader eyebrow="Shop" title="Featured Products" desc="Popular parts and laptops picked by our team." href="/products" linkLabel="View all products" />
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Why LUMI Computer */}
      <section className="container-page py-10 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">Why LUMI Computer</Badge>
          <h2 className="text-balance text-xl font-bold tracking-tight sm:text-3xl">
            A parts shop that knows hardware
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every listing has the specs that matter — socket, chipset, wattage, capacity — so you
            know exactly what fits before you buy.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:mt-10 lg:grid-cols-4">
          {[{
          icon: Cpu,
          title: "Desktop Parts",
          desc: "CPUs, GPUs, motherboards, RAM, storage, PSUs."
        }, {
          icon: Laptop,
          title: "Laptops",
          desc: "Gaming and productivity laptops, ready to ship."
        }, {
          icon: MonitorSmartphone,
          title: "Peripherals",
          desc: "Monitors, keyboards, and accessories."
        }, {
          icon: ShieldCheck,
          title: "Verified Stock",
          desc: "Live stock counts, no overselling."
        }].map(f => <Card key={f.title} className="p-6">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </Card>)}
        </div>
      </section>
    </>;
}
function SectionHeader({
  eyebrow,
  title,
  desc,
  href,
  linkLabel
}) {
  return <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</div>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <p className="mt-2 text-muted-foreground">{desc}</p>
      </div>
      <Button asChild variant="outline" size="sm" className="h-9 shrink-0 sm:h-8">
        <Link href={href}>
          {linkLabel} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>;
}
