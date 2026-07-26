"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Filter, Package, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ORDER_STATUS_BADGE, StatusPill, badgeClass, formatCurrency, formatDate, formatDateTime } from "../helpers";
import { toast } from "sonner";

const PAYMENT_STATUS_BADGE = {
  pending: "bg-warning/15 text-warning",
  paid: "bg-success/15 text-success",
  expired: "bg-muted text-muted-foreground",
  failed: "bg-destructive/15 text-destructive"
};
const STATUS_FILTERS = [{
  value: "all",
  label: "All statuses"
}, {
  value: "processing",
  label: "Processing"
}, {
  value: "shipped",
  label: "Shipped"
}, {
  value: "delivered",
  label: "Delivered"
}, {
  value: "cancelled",
  label: "Cancelled"
}];
export function OrdersView({
  orders
}) {
  const [status, setStatus] = React.useState("all");
  const [viewing, setViewing] = React.useState(null);
  const filtered = React.useMemo(() => {
    if (status === "all") return orders;
    return orders.filter(o => o.status === status);
  }, [orders, status]);
  return <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Orders</h1>
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
              {STATUS_FILTERS.map(f => <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatTile label="Total orders" value={orders.length} />
        <StatTile label="Processing" value={orders.filter(o => o.status === "processing").length} tone="info" />
        <StatTile label="Delivered" value={orders.filter(o => o.status === "delivered").length} tone="success" />
        <StatTile label="Cancelled" value={orders.filter(o => o.status === "cancelled").length} tone="danger" />
      </div>

      <Card className="gap-0 p-0">
        <CardContent className="px-0">
          {/* Mobile: card list */}
          <div className="space-y-3 px-4 py-4 sm:hidden">
            {filtered.map(o => {
            const itemCount = o.items.reduce((n, i) => n + i.qty, 0);
            return <div key={o.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-medium">{o.orderNo}</span>
                    <StatusPill className={badgeClass(ORDER_STATUS_BADGE, o.status)}>
                      {o.status}
                    </StatusPill>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{o.userName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {o.userEmail}
                      </p>
                    </div>
                    <span className="shrink-0 font-semibold">
                      {formatCurrency(o.total)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
                    {formatDate(o.createdAt)}
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => setViewing(o)}>
                    <Eye className="h-3.5 w-3.5" />
                    View details
                  </Button>
                </div>;
          })}
            {filtered.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">
                No orders match this filter.
              </p>}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block">
            <div className="scroll-area-thin overflow-x-auto">
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
                  {filtered.map(o => {
                  const itemCount = o.items.reduce((n, i) => n + i.qty, 0);
                  return <TableRow key={o.id}>
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
                          <Button variant="ghost" size="sm" onClick={() => setViewing(o)}>
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>;
                })}
                  {filtered.length === 0 && <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                        No orders match this filter.
                      </TableCell>
                    </TableRow>}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <OrderDetailDialog order={viewing} onOpenChange={open => !open && setViewing(null)} />
    </div>;
}
function StatTile({
  label,
  value,
  tone = "default"
}) {
  const toneClass = tone === "info" ? "bg-info/10 text-info" : tone === "success" ? "bg-success/10 text-success" : tone === "danger" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary";
  return <Card className="gap-0">
      <CardContent className="flex items-center gap-3 p-4">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${toneClass}`}>
          <Package className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-bold leading-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>;
}
function OrderDetailDialog({
  order,
  onOpenChange
}) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);

  async function updateOrder(patch) {
    if (!order) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(patch)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error || "Failed to update order");
        return;
      }
      toast.success("Order updated");
      router.refresh();
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setSaving(false);
    }
  }

  return <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Order {order?.orderNo}</DialogTitle>
          <DialogDescription>
            Placed on{" "}
            {order ? formatDateTime(order.createdAt) : ""}
          </DialogDescription>
        </DialogHeader>
        {order && <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="font-medium">{order.userName}</p>
                <p className="text-muted-foreground">{order.userEmail}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs uppercase text-muted-foreground">{order.paymentMethod}</span>
                  <StatusPill className={badgeClass(PAYMENT_STATUS_BADGE, order.paymentStatus)}>
                    {order.paymentStatus}
                  </StatusPill>
                </div>
              </div>
            </div>

            {order.shippingAddress && <div className="rounded-lg border border-border p-3 text-sm">
                <p className="text-xs text-muted-foreground">Shipping address</p>
                <p className="mt-1 font-medium">{order.shippingAddress.name}</p>
                <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}
                  {order.shippingAddress.zip ? ` ${order.shippingAddress.zip}` : ""}, {order.shippingAddress.country}
                </p>
                {order.shippingAddress.phone && <p className="text-muted-foreground">{order.shippingAddress.phone}</p>}
              </div>}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Fulfillment status</Label>
                <Select value={order.status} disabled={saving} onValueChange={v => updateOrder({
              status: v
            })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {order.paymentMethod === "cod" && order.paymentStatus === "pending" && <div className="space-y-1.5">
                  <Label>Cash collection</Label>
                  <Button type="button" variant="outline" className="w-full" disabled={saving} onClick={() => updateOrder({
                paymentStatus: "paid"
              })}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Mark cash collected
                  </Button>
                </div>}
            </div>

            <div className="rounded-lg border border-border">
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">
                  Items ({order.items.length})
                </CardTitle>
              </CardHeader>
              <ul className="divide-y divide-border">
                {order.items.map((i, idx) => <li key={idx} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{i.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.qty} × {formatCurrency(i.price)}
                      </p>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(i.qty * i.price)}
                    </span>
                  </li>)}
                {order.items.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No items in this order.
                  </li>}
              </ul>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
              <span className="text-sm font-medium">Total</span>
              <span className="text-lg font-bold">{formatCurrency(order.total)}</span>
            </div>
          </div>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {order && <Button asChild>
              <Link href={`/invoice/${order.orderNo}`}>View invoice</Link>
            </Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}
