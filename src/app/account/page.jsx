import Link from "next/link";
import { Package, Heart, ArrowRight, ArrowUpRight, ShoppingBag, MapPin, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrders, parseJson } from "@/lib/data";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";
const statusBadge = {
  processing: "bg-info text-info-foreground",
  shipped: "bg-warning text-warning-foreground",
  delivered: "bg-success text-success-foreground",
  cancelled: "bg-destructive text-destructive-foreground"
};
function formatDate(iso) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
export default async function AccountDashboardPage() {
  const session = await getSession();
  const firstName = (session?.user?.name || "there").split(" ")[0];
  const orders = await getOrders(session.user.email);
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const wishlistHint = "See all";
  const recentOrders = orders.slice(0, 3);
  return <div className="space-y-6 sm:space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          Welcome back, {firstName}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={Package} label="Total Orders" value={String(totalOrders)} tone="bg-primary/10 text-primary" href="/account/orders" />
        <StatCard icon={ShoppingBag} label="Total Spent" value={`$${totalSpent.toFixed(2)}`} tone="bg-success/15 text-success" href="/account/orders" />
        <StatCard icon={Heart} label="Wishlist" value={wishlistHint} tone="bg-warning/15 text-warning" href="/account/wishlist" />
        <StatCard icon={MapPin} label="Addresses" value="Manage" tone="bg-info/15 text-info" href="/account/addresses" />
      </div>

      {/* Recent orders */}
      <Card className="gap-0">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/account/orders">
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          {recentOrders.length === 0 ? <p className="px-6 py-8 text-sm text-muted-foreground">
              You haven&apos;t placed any orders yet.
            </p> : (/* Mobile: card list. >=sm: table. */
        <>
            <div className="space-y-3 px-4 sm:hidden">
              {recentOrders.map(o => {
              const items = parseJson(o.items, []);
              const itemCount = items.reduce((n, i) => n + i.qty, 0);
              const badgeClass = statusBadge[o.status] ?? "bg-secondary text-secondary-foreground";
              return <div key={o.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-medium">{o.orderNo}</span>
                      <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize", badgeClass)}>
                        {o.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {formatDate(o.createdAt)} · {itemCount} {itemCount === 1 ? "item" : "items"}
                      </span>
                      <span className="font-semibold">${o.total.toFixed(2)}</span>
                    </div>
                    <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                      <Link href="/account/orders">
                        View details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>;
            })}
            </div>
            <div className="hidden sm:block">
            <div className="scroll-area-thin overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map(o => {
                    const items = parseJson(o.items, []);
                    const itemCount = items.reduce((n, i) => n + i.qty, 0);
                    const badgeClass = statusBadge[o.status] ?? "bg-secondary text-secondary-foreground";
                    return <TableRow key={o.id}>
                      <TableCell className="pl-6 font-mono text-xs font-medium">
                        {o.orderNo}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(o.createdAt)}
                      </TableCell>
                      <TableCell>
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${o.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize", badgeClass)}>
                          {o.status}
                        </span>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href="/account/orders">
                            View
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>;
                  })}
              </TableBody>
            </Table>
            </div>
            </div>
            </>)}
        </CardContent>
      </Card>

      {/* Quick links */}
      <section aria-labelledby="quick-links-heading">
        <h3 id="quick-links-heading" className="text-lg font-semibold">
          Quick links
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <QuickLinkCard icon={ShoppingBag} title="Browse Products" description="Shop CPUs, GPUs, laptops, and more." href="/products" tone="bg-primary/10 text-primary" />
          <QuickLinkCard icon={Heart} title="View Wishlist" description="Parts you've saved for later." href="/account/wishlist" tone="bg-warning/15 text-warning" />
          <QuickLinkCard icon={MapPin} title="Manage Addresses" description="Update your shipping addresses." href="/account/addresses" tone="bg-info/15 text-info" />
        </div>
      </section>
    </div>;
}
function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  href
}) {
  return <Link href={href} className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <Card className="gap-0 p-5 transition-shadow group-hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className={cn("grid h-10 w-10 place-items-center rounded-lg", tone)}>
            <Icon className="h-5 w-5" />
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </Card>
    </Link>;
}
function QuickLinkCard({
  icon: Icon,
  title,
  description,
  href,
  tone
}) {
  return <Link href={href} className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <Card className="h-full gap-0 p-5 transition-shadow group-hover:shadow-md">
        <span className={cn("grid h-10 w-10 place-items-center rounded-lg", tone)}>
          <Icon className="h-5 w-5" />
        </span>
        <h4 className="mt-3 font-semibold group-hover:text-primary">
          {title}
        </h4>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Visit <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Card>
    </Link>;
}
