import Link from "next/link";
import Image from "next/image";
import {
  Package,
  GraduationCap,
  Download,
  Heart,
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  FolderGit2,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getOrders,
  getCourses,
  getDownloads,
  parseJson,
} from "@/lib/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";

const statusBadge: Record<string, string> = {
  processing: "bg-info text-info-foreground",
  shipped: "bg-warning text-warning-foreground",
  delivered: "bg-success text-success-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
};

// Deterministic mock progress per course slug — keeps the demo stable.
function mockProgress(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return 30 + (Math.abs(h) % 60); // 30%..89%
}

function formatDate(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AccountDashboardPage() {
  const session = await getServerSession(authOptions);
  const firstName = (session?.user?.name || "there").split(" ")[0];

  const [orders, courses, downloads] = await Promise.all([
    getOrders(),
    getCourses(),
    getDownloads(),
  ]);

  const totalOrders = orders.length;
  const downloadsCount = downloads.length;
  // Mock: 2 active courses regardless of total catalog size
  const activeCourses = Math.min(2, courses.length);
  // Wishlist is client-side persisted; show a hint instead of a hard number.
  const wishlistHint = "See all";

  const recentOrders = orders.slice(0, 3);
  const continueLearning = courses.slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {firstName}
        </h2>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Package}
          label="Total Orders"
          value={String(totalOrders)}
          tone="bg-primary/10 text-primary"
          href="/account/orders"
        />
        <StatCard
          icon={GraduationCap}
          label="Active Courses"
          value={String(activeCourses)}
          tone="bg-success/15 text-success"
          href="/account/courses"
        />
        <StatCard
          icon={Download}
          label="Downloads"
          value={String(downloadsCount)}
          tone="bg-info/15 text-info"
          href="/account/downloads"
        />
        <StatCard
          icon={Heart}
          label="Wishlist"
          value={wishlistHint}
          tone="bg-warning/15 text-warning"
          href="/account/wishlist"
        />
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
          {recentOrders.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">
              You haven&apos;t placed any orders yet.
            </p>
          ) : (
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
                {recentOrders.map((o) => {
                  const items = parseJson<
                    { name: string; qty: number; price: number }[]
                  >(o.items, []);
                  const itemCount = items.reduce((n, i) => n + i.qty, 0);
                  const badgeClass =
                    statusBadge[o.status] ?? "bg-secondary text-secondary-foreground";
                  return (
                    <TableRow key={o.id}>
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
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize",
                            badgeClass
                          )}
                        >
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Continue learning */}
      <section aria-labelledby="continue-learning-heading">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3
              id="continue-learning-heading"
              className="text-lg font-semibold"
            >
              Continue learning
            </h3>
            <p className="text-sm text-muted-foreground">
              Pick up where you left off.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/account/courses">
              All courses
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {continueLearning.map((course) => {
            const progress = mockProgress(course.slug);
            return (
              <Card key={course.id} className="gap-0 p-4 sm:p-5">
                <div className="flex gap-4">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="relative block h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
                  >
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="line-clamp-2 font-semibold leading-tight hover:text-primary"
                    >
                      {course.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      by {course.instructor}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Progress value={progress} className="h-2" />
                      <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                        {progress}%
                      </span>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {course.lessonsCount} lessons · {course.duration}
                  </span>
                  <Button asChild size="sm">
                    <Link href={`/courses/${course.slug}`}>
                      Continue
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick links */}
      <section aria-labelledby="quick-links-heading">
        <h3 id="quick-links-heading" className="text-lg font-semibold">
          Quick links
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <QuickLinkCard
            icon={ShoppingBag}
            title="Browse Products"
            description="Shop components, boards, and starter kits."
            href="/products"
            tone="bg-primary/10 text-primary"
          />
          <QuickLinkCard
            icon={FolderGit2}
            title="Explore Projects"
            description="Find your next build with full docs and code."
            href="/projects"
            tone="bg-success/15 text-success"
          />
          <QuickLinkCard
            icon={Download}
            title="View Downloads"
            description="Source code, PCB files, datasheets, and manuals."
            href="/downloads"
            tone="bg-info/15 text-info"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="gap-0 p-5 transition-shadow group-hover:shadow-md">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "grid h-10 w-10 place-items-center rounded-lg",
              tone
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </Card>
    </Link>
  );
}

function QuickLinkCard({
  icon: Icon,
  title,
  description,
  href,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  tone: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="h-full gap-0 p-5 transition-shadow group-hover:shadow-md">
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-lg",
            tone
          )}
        >
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
    </Link>
  );
}
