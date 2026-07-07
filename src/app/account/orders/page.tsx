import Link from "next/link";
import { Package, ChevronRight, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrders, parseJson } from "@/lib/data";
import { cn } from "@/lib/utils";

const statusBadge: Record<string, string> = {
  processing: "bg-info text-info-foreground",
  shipped: "bg-warning text-warning-foreground",
  delivered: "bg-success text-success-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
};

function formatDate(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">My Orders</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and review the orders you&apos;ve placed with KBSCircuit.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/products">
            <ArrowRight className="h-4 w-4" />
            Shop more
          </Link>
        </Button>
      </header>

      {orders.length === 0 ? (
        <Card className="p-0">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
              <Package className="h-8 w-8" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">No orders yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              When you place an order it will appear here with its current
              status and tracking information.
            </p>
            <Button asChild className="mt-5">
              <Link href="/products">Browse products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="gap-0 p-0">
          <CardHeader className="border-b">
            <CardTitle>
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {/* Mobile: card list */}
            <div className="space-y-3 px-4 py-4 sm:hidden">
              {orders.map((o) => {
                const items = parseJson<
                  { name: string; qty: number; price: number }[]
                >(o.items, []);
                const firstItem = items[0];
                const moreCount = Math.max(0, items.length - 1);
                const itemCount = items.reduce((n, i) => n + i.qty, 0);
                const badgeClass =
                  statusBadge[o.status] ??
                  "bg-secondary text-secondary-foreground";
                return (
                  <div key={o.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-medium">{o.orderNo}</span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize",
                          badgeClass
                        )}
                      >
                        {o.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      {firstItem ? (
                        <span className="line-clamp-1">
                          {firstItem.name}
                          {moreCount > 0 && (
                            <span className="text-muted-foreground"> +{moreCount} more</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No items</span>
                      )}
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
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Desktop: table */}
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
                    {orders.map((o) => {
                      const items = parseJson<
                        { name: string; qty: number; price: number }[]
                      >(o.items, []);
                      const firstItem = items[0];
                      const moreCount = Math.max(0, items.length - 1);
                      const itemCount = items.reduce((n, i) => n + i.qty, 0);
                      const badgeClass =
                        statusBadge[o.status] ??
                        "bg-secondary text-secondary-foreground";
                      return (
                        <TableRow key={o.id}>
                          <TableCell className="pl-6 font-mono text-xs font-medium">
                            {o.orderNo}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(o.createdAt)}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <span className="line-clamp-1 text-sm">
                              {firstItem ? (
                                <>
                                  {firstItem.name}
                                  {moreCount > 0 && (
                                    <span className="text-muted-foreground">
                                      {" "}
                                      +{moreCount} more
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted-foreground">
                                  No items
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {itemCount} {itemCount === 1 ? "item" : "items"}
                            </span>
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
                                <ChevronRight className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
