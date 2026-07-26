"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ExternalLink, Bell, ChevronDown, Package, Receipt, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { AdminSidebar } from "./admin-sidebar";
import { useSession, signOut } from "@/components/session-provider";
import { initialsFromName } from "@/lib/password-rules";
import { toast } from "sonner";

const ICONS = {
  product: Package,
  order: Receipt,
  customer: UserIcon
};
const LABELS = {
  product: "Products",
  order: "Orders",
  customer: "Customers"
};

export function AdminTopbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [open, setOpen] = React.useState(false);
  async function handleSignOut() {
    await signOut();
    toast.success("You've been signed out.");
    router.push("/");
    router.refresh();
  }

  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  const grouped = results.reduce((acc, r) => {
    (acc[r.type] = acc[r.type] || []).push(r);
    return acc;
  }, {});

  return <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
      {/* Mobile: open sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin navigation</SheetTitle>
          </SheetHeader>
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <button type="button" onClick={() => setSearchOpen(true)} className="relative hidden flex-1 items-center rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent sm:flex sm:max-w-sm">
        <Search className="mr-2 h-4 w-4" />
        Search products, orders, customers…
      </button>
      <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Search" onClick={() => setSearchOpen(true)}>
        <Search className="h-4 w-4" />
      </Button>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search products, orders, customers…" value={query} onValueChange={setQuery} />
        <CommandList>
          {loading && <div className="p-4 text-sm text-muted-foreground">Searching...</div>}
          <CommandEmpty>
            {query ? "No results found." : "Type to search the admin console."}
          </CommandEmpty>
          {Object.entries(grouped).map(([type, hits]) => <CommandGroup key={type} heading={LABELS[type] || type}>
              {hits.map(hit => {
            const Icon = ICONS[hit.type];
            return <CommandItem key={`${hit.type}-${hit.href}-${hit.title}`} value={`${hit.title} ${hit.desc}`} onSelect={() => {
              router.push(hit.href);
              setSearchOpen(false);
              setQuery("");
            }} className="cursor-pointer">
                    <Icon className="h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{hit.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">{hit.desc}</span>
                    </div>
                  </CommandItem>;
          })}
            </CommandGroup>)}
        </CommandList>
      </CommandDialog>

      <div className="ml-auto flex items-center gap-1.5">
        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
          <Link href="/">
            <ExternalLink className="h-4 w-4" />
            View store
          </Link>
        </Button>

        <Button variant="ghost" size="icon" aria-label="Notifications" onClick={() => toast.info("No new notifications")}>
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full p-0.5 pr-2 text-sm transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Admin account">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                  {initialsFromName(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">{user?.name || "Admin"}</span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:inline" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name || "Admin"}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/account")}>
              My account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>;
}
