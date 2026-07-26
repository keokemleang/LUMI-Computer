import Link from "next/link";
import { Search, Truck, Wrench, RefreshCw, UserCircle, Cpu, Mail, MessagesSquare, BookOpen, ArrowRight, LifeBuoy } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
export const metadata = {
  title: "Support",
  description: "Find answers, browse support categories, and contact the LUMI Computer team for help with orders, products, and accounts."
};
const CATEGORIES = [{
  icon: Cpu,
  title: "Compatibility",
  description: "Socket, chipset, wattage, and clearance questions.",
  href: "/contact",
  cta: "Ask a question",
  tone: "bg-primary/10 text-primary"
}, {
  icon: Truck,
  title: "Orders & Shipping",
  description: "Track orders, shipping rates, delivery times, and customs.",
  href: "/contact",
  cta: "Contact fulfillment",
  tone: "bg-success/15 text-success"
}, {
  icon: Wrench,
  title: "Technical Support",
  description: "Won't POST, driver issues, and troubleshooting.",
  href: "/contact",
  cta: "Get help",
  tone: "bg-warning/15 text-warning"
}, {
  icon: RefreshCw,
  title: "Returns & Refunds",
  description: "30-day returns, refund policy, and how to start a return.",
  href: "/contact",
  cta: "Start a return",
  tone: "bg-danger/15 text-danger"
}, {
  icon: UserCircle,
  title: "Account",
  description: "Sign in, reset your password, and manage your profile.",
  href: "/contact",
  cta: "Account help",
  tone: "bg-info/15 text-info"
}];
const FAQS = [{
  q: "How long does shipping take?",
  a: "Standard shipping takes 3–7 business days within the US and 7–21 days internationally. Express options are available at checkout. You'll receive a tracking number as soon as your order ships."
}, {
  q: "Do you ship internationally?",
  a: "Yes — we ship to over 40 countries. Customs duties and import taxes may apply and are the recipient's responsibility. Shipping rates are calculated at checkout based on destination and weight."
}, {
  q: "What is your warranty on parts?",
  a: "All parts carry the manufacturer's warranty, and we back every order with a 12-month defect guarantee. If a part arrives dead or fails within warranty, contact us with your order number for a free replacement."
}, {
  q: "Will this part fit my build?",
  a: "Each product page lists socket, chipset, form factor, and clearance details. If you're not sure, contact support with your current parts list and we'll confirm compatibility before you order."
}, {
  q: "Can I return an opened part?",
  a: "Yes, within 30 days, as long as it's in resalable condition with original packaging. CPUs and motherboards are inspected for bent pins before a refund is issued."
}, {
  q: "Do laptops come with a warranty?",
  a: "All laptops include the manufacturer's standard warranty, typically 12–24 months depending on the model. Extended coverage is available at checkout on select models."
}];
const CHANNELS = [{
  icon: Mail,
  title: "Email Support",
  value: "support@lumicomputer.com",
  href: "/contact",
  description: "Replies within 1 business day."
}, {
  icon: MessagesSquare,
  title: "Live Chat",
  value: "Chat with us",
  href: "/contact",
  description: "Get help from our support team."
}, {
  icon: BookOpen,
  title: "Order Help",
  value: "Track an order",
  href: "/account/orders",
  description: "Check status and shipping updates."
}];
export default function SupportPage() {
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
          <Input type="search" placeholder="Search for 'shipping', 'refund', 'compatibility'…" aria-label="Search support articles" className="h-12 pl-11 text-base" />
        </div>
      </section>

      {/* Categories grid */}
      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Browse by category
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(c => <Link key={c.title} href={c.href} className="group block h-full">
              <Card className="flex h-full flex-col gap-3 p-5 transition-shadow hover:shadow-md">
                <span className={`grid h-11 w-11 place-items-center rounded-lg ${c.tone}`}>
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
            </Link>)}
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
            {FAQS.map((f, i) => <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </Card>
      </section>

      {/* Support channels */}
      <section className="mt-14">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Talk to us
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {CHANNELS.map(c => <Link key={c.title} href={c.href} className="group block h-full">
              <Card className="flex h-full flex-col gap-2 p-5 transition-shadow hover:shadow-md">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm font-medium text-primary">{c.value}</p>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </Card>
            </Link>)}
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
    </div>;
}
