"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  GraduationCap,
  Download,
  FolderGit2,
  Heart,
  MapPin,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface AccountUser {
  name: string | null;
  email: string | null;
  image: string | null;
  initials: string;
  role: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/courses", label: "Courses", icon: GraduationCap },
  { href: "/account/downloads", label: "Downloads", icon: Download },
  { href: "/account/projects", label: "Projects", icon: FolderGit2 },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/account") return pathname === "/account";
  return pathname === href || pathname.startsWith(href + "/");
}

export function AccountSidebar({ user }: { user: AccountUser }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut({ redirect: false });
    toast.success("You've been signed out.");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="lg:sticky lg:top-20 lg:self-start">
      {/* Profile card (desktop only — mobile shows the inline nav) */}
      <Card className="hidden gap-0 p-5 lg:block">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            {user.image ? <AvatarImage src={user.image} alt={user.name || "Account"} /> : null}
            <AvatarFallback className="bg-primary/15 text-base font-semibold text-primary">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight">{user.name || "Account"}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </Card>

      {/* Desktop nav */}
      <nav aria-label="Account" className="mt-4 hidden lg:block">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile: profile row + horizontal scrollable nav */}
      <div className="lg:hidden">
        <Card className="gap-0 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              {user.image ? <AvatarImage src={user.image} alt={user.name || "Account"} /> : null}
              <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold leading-tight">{user.name || "Account"}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              aria-label="Sign out"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <nav
          aria-label="Account"
          className="mt-3 -mx-4 overflow-x-auto px-4 pb-1"
        >
          <ul className="flex w-max gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
