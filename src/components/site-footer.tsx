import Link from "next/link";
import { Cpu, Github, Twitter, Youtube, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Project Kits", href: "/categories/project-kits" },
      { label: "Starter Kits", href: "/categories/starter-kits" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Projects", href: "/projects" },
      { label: "Courses", href: "/courses" },
      { label: "Tutorials", href: "/blog" },
      { label: "Downloads", href: "/downloads" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Community Hub", href: "/community" },
      { label: "Blog", href: "/blog" },
      { label: "Support", href: "/support" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Account", href: "/account" },
      { label: "Admin", href: "/admin" },
      { label: "Cart", href: "/cart" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="container-page py-12">
        {/* Newsletter */}
        <div className="mb-12 grid gap-6 rounded-xl border border-border bg-card p-6 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-lg font-semibold">Stay in the loop</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get the latest tutorials, project ideas, and product drops in your inbox.
            </p>
          </div>
          <form className="flex gap-2" action="/api/newsletter" method="POST">
            <Input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="bg-background"
              aria-label="Email address"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
                <Cpu className="h-5 w-5" />
              </span>
              KBSCircuit
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The complete engineering learning platform. Learn, build, and experiment with
              electronics — all in one place.
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="icon" asChild aria-label="GitHub">
                <a href="https://github.com" target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild aria-label="Twitter">
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild aria-label="YouTube">
                <a href="https://youtube.com" target="_blank" rel="noreferrer">
                  <Youtube className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild aria-label="Email">
                <a href="mailto:hello@kbscircuit.com">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} KBSCircuit. Built for makers, students, and engineers.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/support" className="hover:text-foreground">Support</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
