import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  Rocket,
  Truck,
  Wrench,
  RefreshCw,
  UserCircle,
  GraduationCap,
  Mail,
  MessagesSquare,
  BookOpen,
  ArrowRight,
  LifeBuoy,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Find answers, browse support categories, and contact the KBSCircuit team for help with orders, products, courses, and accounts.",
};

const CATEGORIES = [
  {
    icon: Rocket,
    title: "Getting Started",
    description: "Set up your board, install the IDE, and blink your first LED.",
    href: "/courses",
    cta: "Browse starter courses",
    tone: "bg-primary/10 text-primary",
  },
  {
    icon: Truck,
    title: "Orders & Shipping",
    description: "Track orders, shipping rates, delivery times, and customs.",
    href: "/contact",
    cta: "Contact fulfillment",
    tone: "bg-success/15 text-success",
  },
  {
    icon: Wrench,
    title: "Technical Questions",
    description: "Wiring, datasheets, drivers, and code troubleshooting.",
    href: "/downloads",
    cta: "Open downloads",
    tone: "bg-warning/15 text-warning",
  },
  {
    icon: RefreshCw,
    title: "Returns & Refunds",
    description: "30-day returns, refund policy, and how to start a return.",
    href: "/contact",
    cta: "Start a return",
    tone: "bg-danger/15 text-danger",
  },
  {
    icon: UserCircle,
    title: "Account",
    description: "Sign in, reset your password, and manage your profile.",
    href: "/contact",
    cta: "Account help",
    tone: "bg-info/15 text-info",
  },
  {
    icon: GraduationCap,
    title: "Courses",
    description: "Course access, certificates, lessons, and lifetime updates.",
    href: "/courses",
    cta: "Browse courses",
    tone: "bg-primary/10 text-primary",
  },
];

const FAQS = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 3–7 business days within the US and 7–21 days internationally. Express options are available at checkout. You'll receive a tracking number as soon as your order ships.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes — we ship to over 60 countries. Customs duties and import taxes may apply and are the recipient's responsibility. Shipping rates are calculated at checkout based on destination and weight.",
  },
  {
    q: "What is your warranty on boards and kits?",
    a: "All boards and kits come with a 12-month warranty against manufacturing defects. If your board arrives dead or fails within warranty, contact us with your order number for a free replacement.",
  },
  {
    q: "How do I access my course after purchase?",
    a: "Courses are available immediately after purchase in your account under 'My Courses'. You get lifetime access — including all future updates to the lessons and resources — on both mobile and desktop.",
  },
  {
    q: "Do I get a certificate for completing a course?",
    a: "Yes. Every course includes a verifiable certificate of completion. Once you finish all lessons, your certificate is generated automatically and can be downloaded as a PDF from your dashboard.",
  },
  {
    q: "Can I get a refund on a course?",
    a: "We offer a 14-day money-back guarantee on all courses. If a course isn't right for you, contact us within 14 days of purchase for a full refund — no questions asked.",
  },
  {
    q: "Are the project kits beginner-friendly?",
    a: "Most kits are designed for beginners and include step-by-step wiring diagrams, code, and video walkthroughs. Each kit page lists the recommended experience level and prerequisite skills.",
  },
  {
    q: "How do I download source code and PCB files?",
    a: "Source code, PCB Gerbers, datasheets, and lab manuals are available on the Downloads page. Each project and course page also links directly to the relevant files.",
  },
];

const CHANNELS = [
  {
    icon: Mail,
    title: "Email Support",
    value: "support@kbscircuit.com",
    href: "/contact",
    description: "Replies within 1 business day.",
  },
  {
    icon: MessagesSquare,
    title: "Community",
    value: "Join the forum",
    href: "/community",
    description: "Get help from peers and experts.",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    value: "docs.kbscircuit.com",
    href: "/downloads",
    description: "Datasheets, manuals, and guides.",
  },
];

export default function SupportPage() {
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
            <BreadcrumbPage>Support</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero with search */}
      <section className="mt-6 space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          How can we help?
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Search for guides, troubleshooting tips, and answers — or browse the
          support categories below.
        </p>
        <div className="relative mx-auto max-w-2xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for 'shipping', 'refund', 'ESP32'…"
            aria-label="Search support articles"
            className="h-12 pl-11 text-base"
          />
        </div>
      </section>

      {/* Categories grid */}
      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Browse by category
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link key={c.title} href={c.href} className="group block h-full">
              <Card className="flex h-full flex-col gap-3 p-5 transition-shadow hover:shadow-md">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-lg ${c.tone}`}
                >
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="font-semibold leading-tight group-hover:text-primary">
                  {c.title}
                </h3>
                <p className="text-sm text-muted-foreground">{c.description}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary">
                  {c.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Frequently asked questions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Quick answers to the most common questions.
            </p>
          </div>
          <Badge variant="secondary">{FAQS.length} articles</Badge>
        </div>

        <Card className="mt-5 p-4 sm:p-6">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </section>

      {/* Support channels */}
      <section className="mt-14">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Talk to us
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {CHANNELS.map((c) => (
            <Link key={c.title} href={c.href} className="group block h-full">
              <Card className="flex h-full flex-col gap-2 p-5 transition-shadow hover:shadow-md">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm font-medium text-primary">{c.value}</p>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mt-14">
        <Card className="flex flex-col items-start gap-4 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <LifeBuoy className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">Still need help?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Our team is here for you. Send us a message and we'll get back
                within one business day.
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link href="/contact">
              Contact us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
