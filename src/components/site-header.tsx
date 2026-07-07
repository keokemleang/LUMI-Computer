"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Menu, ShoppingCart, Cpu, ChevronDown, LogIn, UserPlus, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeaderAuth } from "@/components/header-auth";
import { SearchDialog } from "@/components/search-dialog";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/projects", label: "Projects" },
  { href: "/courses", label: "Courses" },
  { href: "/downloads", label: "Downloads" },
  { href: "/blog", label: "Blog" },
  { href: "/community", label: "Community" },
  { href: "/support", label: "Support" },
  { href: "/about", label: "About" },
];

const productCategories = [
  { title: "Arduino", href: "/categories/arduino", desc: "Boards & shields" },
  { title: "ESP32", href: "/categories/esp32", desc: "Wi-Fi & Bluetooth MCUs" },
  { title: "STM32", href: "/categories/stm32", desc: "ARM Cortex-M boards" },
  { title: "Raspberry Pi", href: "/categories/raspberry-pi", desc: "Single-board computers" },
  { title: "Sensors", href: "/categories/sensors", desc: "Environment & motion" },
  { title: "Displays", href: "/categories/displays", desc: "OLED, TFT, LCD" },
  { title: "Motors", href: "/categories/motors", desc: "Servo, stepper, DC" },
  { title: "Starter Kits", href: "/categories/starter-kits", desc: "Beginner bundles" },
];

function useCartCount() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  return count;
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [open, setOpen] = React.useState(false);
  const cartCount = useCartCount();
  // Intelligent hide/show on mobile; compact-on-scroll on desktop.
  // `open` forces the header visible so the hamburger button stays reachable
  // while the mobile drawer is open.
  const { hidden, compact } = useScrollHeader(open);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const isLoggedIn = status === "authenticated" && !!session?.user;
  const isAdmin = isLoggedIn && (session?.user as any)?.role === "admin";

  async function handleMobileSignOut() {
    setOpen(false);
    await signOut({ redirect: false });
    toast.success("You've been signed out.");
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transition-[transform,height,box-shadow] duration-300 ease-out will-change-transform",
        hidden ? "-translate-y-full" : "translate-y-0",
        compact && !hidden && "shadow-sm",
      )}
    >
      <div
        className={cn(
          "container-page flex items-center gap-4 transition-[height] duration-200 ease-out",
          compact ? "h-14" : "h-16",
        )}
      >
        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="border-b px-6 py-4">
              <SheetTitle className="text-left">
                <Link href="/" className="flex items-center gap-2 font-bold" onClick={() => setOpen(false)}>
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
                    <Cpu className="h-5 w-5" />
                  </span>
                  KBSCircuit
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-border" />
              {isLoggedIn ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium text-foreground/70 hover:bg-accent hover:text-foreground"
                  >
                    My Account
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex min-h-[44px] items-center gap-2 rounded-md px-3 text-sm font-medium text-foreground/70 hover:bg-accent hover:text-foreground"
                    >
                      <ShieldCheck className="h-4 w-4" /> Admin Console
                    </Link>
                  )}
                  <button
                    onClick={handleMobileSignOut}
                    className="flex min-h-[44px] items-center gap-2 rounded-md px-3 text-left text-sm font-medium text-foreground/70 hover:bg-accent hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center gap-2 rounded-md px-3 text-sm font-medium text-foreground/70 hover:bg-accent hover:text-foreground"
                  >
                    <LogIn className="h-4 w-4" /> Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <UserPlus className="h-4 w-4" /> Create account
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Cpu className="h-5 w-5" />
          </span>
          <span className="hidden text-lg tracking-tight sm:inline">KBSCircuit</span>
        </Link>

        {/* Desktop nav */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[640px] grid-cols-2 gap-1 p-3">
                  <Link
                    href="/products"
                    className="col-span-2 flex items-center justify-between rounded-md border border-border bg-accent/50 px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    Browse all products
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Link>
                  {productCategories.map((c) => (
                    <NavigationMenuLink
                      key={c.href}
                      asChild
                    >
                      <Link
                        href={c.href}
                        className="block rounded-md p-3 transition-colors hover:bg-accent"
                      >
                        <div className="text-sm font-medium">{c.title}</div>
                        <div className="text-xs text-muted-foreground">{c.desc}</div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {navLinks.filter((l) => l.href !== "/products").map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive(link.href) && "text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          <SearchDialog />
          <Button variant="ghost" size="icon" asChild aria-label="Cart" className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-[1.15rem] w-[1.15rem]" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          <ThemeToggle />
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
