"use client";

import * as React from "react";
import { Eye, Filter, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ORDER_STATUS_BADGE,
  StatusPill,
  badgeClass,
  formatCurrency,
  formatDate,
  formatDateTime,
} from "../helpers";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface AdminOrderLite {
  id: string;
  orderNo: string;
  userName: string;
  userEmail: string;
  total: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
}

interface OrdersViewProps {
  orders: AdminOrderLite[];
}

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrdersView({ orders }: OrdersViewProps) {
  const [status, setStatus] = React.useState<string>("all");
  const [viewing, setViewing] = React.useState<AdminOrderLite | null>(null);

  const filtered = React.useMemo(() => {
    if (status === "all") return orders;
    return orders.filter((o) => o.status === status);
  }, [orders, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and fulfill customer orders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatTile label="Total orders" value={orders.length} />
        <StatTile
          label="Processing"
          value={orders.filter((o) => o.status === "processing").length}
          tone="info"
        />
        <StatTile
          label="Delivered"
          value={orders.filter((o) => o.status === "delivered").length}
          tone="success"
        />
        <StatTile
          label="Cancelled"
          value={orders.filter((o) => o.status === "cancelled").length}
          tone="danger"
        />
      </div>

      <Card className="gap-0 p-0">
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => {
                const itemCount = o.items.reduce((n, i) => n + i.qty, 0);
                return (
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
                    <TableCell className="hidden md:table-cell text-sm">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(o.total)}
                    </TableCell>
                    <TableCell>
                      <StatusPill className={badgeClass(ORDER_STATUS_BADGE, o.status)}>
                        {o.status}
                      </StatusPill>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {formatDate(o.createdAt)}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewing(o)}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    No orders match this filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OrderDetailDialog
        order={viewing}
        onOpenChange={(open) => !open && setViewing(null)}
      />
    </div>
  );
}

function StatTile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "info" | "success" | "danger";
}) {
  const toneClass =
    tone === "info"
      ? "bg-info/10 text-info"
      : tone === "success"
      ? "bg-success/10 text-success"
      : tone === "danger"
      ? "bg-destructive/10 text-destructive"
      : "bg-primary/10 text-primary";
  return (
    <Card className="gap-0">
      <CardContent className="flex items-center gap-3 p-4">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${toneClass}`}
        >
          <Package className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-bold leading-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderDetailDialog({
  order,
  onOpenChange,
}: {
  order: AdminOrderLite | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Order {order?.orderNo}</DialogTitle>
          <DialogDescription>
            Placed on{" "}
            {order ? formatDateTime(order.createdAt) : ""}
          </DialogDescription>
        </DialogHeader>
        {order && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="font-medium">{order.userName}</p>
                <p className="text-muted-foreground">{order.userEmail}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <StatusPill className={badgeClass(ORDER_STATUS_BADGE, order.status)}>
                  {order.status}
                </StatusPill>
              </div>
            </div>

            <div className="rounded-lg border border-border">
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">
                  Items ({order.items.length})
                </CardTitle>
              </CardHeader>
              <ul className="divide-y divide-border">
                {order.items.map((i, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{i.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.qty} × {formatCurrency(i.price)}
                      </p>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(i.qty * i.price)}
                    </span>
                  </li>
                ))}
                {order.items.length === 0 && (
                  <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No items in this order.
                  </li>
                )}
              </ul>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
              <span className="text-sm font-medium">Total</span>
              <span className="text-lg font-bold">{formatCurrency(order.total)}</span>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
