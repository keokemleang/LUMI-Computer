import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  LifeBuoy,
  Users,
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the KBSCircuit team. We help with orders, technical questions, courses, and partnerships.",
};

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "support@kbscircuit.com",
    href: "mailto:support@kbscircuit.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (415) 555-0142",
    href: "tel:+14155550142",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Remote-first · HQ in San Francisco, CA",
    href: null,
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon – Fri, 9am – 6pm PT",
    href: null,
  },
];

export default function ContactPage() {
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
            <BreadcrumbPage>Contact</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 max-w-2xl space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Get in touch
        </h1>
        <p className="text-muted-foreground">
          Questions about an order, a product, or a course? Fill out the form
          and we&apos;ll get back to you within one business day. You can also
          reach us through any of the channels below.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        {/* LEFT — form + contact info */}
        <div className="space-y-6">
          <Card className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold">Send us a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fields marked are required. We never share your email.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold">Contact info</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {CONTACT_INFO.map((c) => (
                <div key={c.label} className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {c.label}
                    </dt>
                    <dd className="mt-0.5 break-words text-sm font-medium text-foreground">
                      {c.href ? (
                        <a
                          href={c.href}
                          className="hover:text-primary hover:underline"
                        >
                          {c.value}
                        </a>
                      ) : (
                        c.value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        {/* RIGHT — support info + map + links */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <LifeBuoy className="h-4 w-4 text-primary" />
              Need a faster answer?
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Many common questions about shipping, refunds, and course access
              are covered in our support center.
            </p>
            <Button asChild variant="outline" className="mt-4 w-full justify-between">
              <Link href="/support">
                Visit support center
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Separator className="my-4" />
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4 text-primary" />
              Ask the community
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Thousands of makers and engineers are already helping each other
              in our forum.
            </p>
            <Button asChild variant="outline" className="mt-4 w-full justify-between">
              <Link href="/community">
                Join the community
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>

          {/* Map placeholder */}
          <Card className="overflow-hidden p-0">
            <div className="relative aspect-[4/3] w-full bg-muted">
              {/* Stylized map placeholder — semantic colors only */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    <MapPin className="h-6 w-6" />
                  </span>
                  <p className="text-sm font-medium">San Francisco, CA</p>
                  <p className="text-xs text-muted-foreground">
                    Remote-first team
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="flex items-start gap-3 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-success/15 text-success">
              <MessageSquare className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold">Partnerships &amp; press</div>
              <p className="mt-1 text-xs text-muted-foreground">
                For bulk orders, educational partnerships, or media inquiries,
                email{" "}
                <a
                  href="mailto:hello@kbscircuit.com"
                  className="font-medium text-primary hover:underline"
                >
                  hello@kbscircuit.com
                </a>
                .
              </p>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
