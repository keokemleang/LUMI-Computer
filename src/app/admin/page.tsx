import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  GraduationCap,
  FolderGit2,
  Download,
  Newspaper,
  ArrowUpRight,
  ArrowDownRight,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  getDashboardStats,
  getAdminOrders,
  getAdminProducts,
  parseJson,
} from "@/lib/data";
import { RevenueChart } from "./revenue-chart";
import { QuickActions } from "./quick-actions";
import {
  ORDER_STATUS_BADGE,
  StatusPill,
  badgeClass,
  formatCurrency,
  formatDate,
} from "./helpers";

export const metadata = { title: "Dashboard" };

interface StatDef {
  key: string;
  label: string;
  value: string;
  icon: LucideIcon;
  trend: number;
  hint: string;
}

export default async function AdminDashboardPage() {
  const [stats, orders, products] = await Promise.all([
    getDashboardStats(),
    getAdminOrders(),
    getAdminProducts(),
  ]);

  const statDefs: StatDef[] = [
    {
      key: "revenue",
      label: "Revenue",
      value: formatCurrency(stats.revenue),
      icon: DollarSign,
      trend: 12.4,
      hint: "vs. last month",
    },
    {
      key: "orders",
      label: "Orders",
      value: stats.orders.toLocaleString(),
      icon: ShoppingCart,
      trend: 8.1,
      hint: "vs. last month",
    },
    {
      key: "products",
      label: "Products",
      value: stats.products.toLocaleString(),
      icon: Package,
      trend: 3.2,
      hint: "vs. last month",
    },
    {
      key: "customers",
      label: "Customers",
      value: stats.customers.toLocaleString(),
      icon: Users,
      trend: 5.7,
      hint: "vs. last month",
    },
    {
      key: "courses",
      label: "Courses",
      value: stats.courses.toLocaleString(),
      icon: GraduationCap,
      trend: -1.4,
      hint: "vs. last month",
    },
    {
      key: "projects",
      label: "Projects",
      value: stats.projects.toLocaleString(),
      icon: FolderGit2,
      trend: 2.1,
      hint: "vs. last month",
    },
    {
      key: "downloads",
      label: "Downloads",
      value: stats.downloads.toLocaleString(),
      icon: Download,
      trend: 14.6,
      hint: "vs. last month",
    },
    {
      key: "blogPosts",
      label: "Blog posts",
      value: stats.blogPosts.toLocaleString(),
      icon: Newspaper,
      trend: -0.8,
      hint: "vs. last month",
    },
  ];

  const recentOrders = orders.slice(0, 5);
  const lowStock = products
    .filter((p) => p.stock < 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);
  const topProducts = [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back. Here&apos;s what&apos;s happening across KBSCircuit today.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            View store
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statDefs.map((s) => {
          const Icon = s.icon;
          const up = s.trend >= 0;
          return (
            <Card key={s.key} className="gap-0">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium ${
                      up
                        ? "bg-success/15 text-success"
                        : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {up ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(s.trend).toFixed(1)}%
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight">
                  {s.value}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {s.label}
                  <span className="text-xs"> · {s.hint}</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue chart + quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Revenue overview</CardTitle>
              <CardDescription>Monthly revenue for the last 12 months</CardDescription>
            </div>
            <span className="rounded-md bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
              +18.2% YoY
            </span>
          </CardHeader>
          <CardContent className="pt-0">
            <RevenueChart />
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Jump straight to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <QuickActionsInline />
          </CardContent>
        </Card>
      </div>

      {/* Recent orders + side columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 gap-0 p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Recent orders</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            {/* Mobile: card list */}
            <div className="space-y-3 px-4 py-4 sm:hidden">
              {recentOrders.map((o) => (
                <div key={o.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-medium">{o.orderNo}</span>
                    <StatusPill className={badgeClass(ORDER_STATUS_BADGE, o.status)}>
                      {o.status}
                    </StatusPill>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                    <span className="truncate font-medium">{o.userName}</span>
                    <span className="font-semibold">{formatCurrency(o.total)}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {o.userEmail} · {formatDate(o.createdAt)}
                  </p>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No orders yet.
                </p>
              )}
            </div>

            {/* Desktop: table */}
            <div className="hidden sm:block">
              <div className="scroll-area-thin overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-6 text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="pl-6 font-mono text-xs font-medium">
                          {o.orderNo}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{o.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {o.userEmail}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(o.total)}
                        </TableCell>
                        <TableCell>
                          <StatusPill className={badgeClass(ORDER_STATUS_BADGE, o.status)}>
                            {o.status}
                          </StatusPill>
                        </TableCell>
                        <TableCell className="pr-6 text-right text-sm text-muted-foreground">
                          {formatDate(o.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {recentOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                          No orders yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Top products */}
          <Card className="gap-0">
            <CardHeader>
              <CardTitle>Top products</CardTitle>
              <CardDescription>By review count</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-3">
                {topProducts.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.category.name} · {p.reviewCount} reviews
                      </p>
                    </div>
                    <span className="text-sm font-semibold">{formatCurrency(p.price)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Low stock */}
          <Card className="gap-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Low stock alerts</CardTitle>
                <CardDescription>Stock &lt; 10 units</CardDescription>
              </div>
              <span className="rounded-md bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                {lowStock.length} items
              </span>
            </CardHeader>
            <CardContent className="pt-0">
              {lowStock.length === 0 ? (
                <p className="text-sm text-muted-foreground">All products are well-stocked.</p>
              ) : (
                <ul className="space-y-3">
                  {lowStock.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.sku}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${
                          p.stock === 0
                            ? "bg-destructive/15 text-destructive"
                            : "bg-warning/15 text-warning"
                        }`}
                      >
                        {p.stock} left
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick actions row at bottom (as specified) */}
      <QuickActions />
    </div>
  );
}

// Inline quick actions used in the side card (simpler than router-based one)
function QuickActionsInline() {
  return (
    <div className="grid gap-2">
      <Button asChild variant="outline" className="justify-start">
        <Link href="/admin/products">
          <Package className="h-4 w-4" />
          Add product
        </Link>
      </Button>
      <Button asChild variant="outline" className="justify-start">
        <Link href="/admin/courses">
          <GraduationCap className="h-4 w-4" />
          Add course
        </Link>
      </Button>
      <Button asChild variant="outline" className="justify-start">
        <Link href="/admin/blog">
          <Newspaper className="h-4 w-4" />
          Add blog post
        </Link>
      </Button>
    </div>
  );
}
