import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { computeOrderTotals } from "@/lib/pricing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PrintButton } from "./print-button";

function formatPrice(n) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}
function formatDate(d) {
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export const metadata = {
  title: "Invoice"
};

export default async function InvoicePage({
  params
}) {
  const { orderNo } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/invoice/${orderNo}`);
  }

  const order = await db.order.findUnique({
    where: {
      orderNo
    }
  });
  if (!order) notFound();

  const isOwner = order.userEmail === session.user.email;
  const isAdmin = session.user.role === "admin";
  if (!isOwner && !isAdmin) notFound();

  const items = JSON.parse(order.items || "[]");
  const address = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const { shipping, tax } = computeOrderTotals(subtotal);

  return <div className="container-page py-6 md:py-10">
      <div className="no-print mb-6 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href={isAdmin && !isOwner ? "/admin/orders" : "/account/orders"}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <PrintButton />
      </div>

      <Card className="mx-auto max-w-3xl gap-0 p-8 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
                <svg viewBox="0 0 30 30" className="h-5 w-5">
                  <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M8.5,20 V13.5 H15 V9.5 H21.5 V16" />
                  <rect fill="currentColor" x="6.3" y="18.4" width="4.4" height="3.2" rx="0.6" />
                  <rect fill="currentColor" x="19.3" y="14.4" width="4.4" height="3.2" rx="0.6" />
                </svg>
              </span>
              <span className="text-lg font-bold tracking-tight">LUMI Computer</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Computer parts &amp; laptops</p>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold tracking-tight">Invoice</h1>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{order.orderNo}</p>
            <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bill to</p>
            <p className="mt-1 font-medium">{order.userName}</p>
            <p className="text-sm text-muted-foreground">{order.userEmail}</p>
          </div>
          {address && <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ship to</p>
              <p className="mt-1 font-medium">{address.name}</p>
              <p className="text-sm text-muted-foreground">{address.street}</p>
              <p className="text-sm text-muted-foreground">
                {address.city}
                {address.zip ? ` ${address.zip}` : ""}, {address.country}
              </p>
              {address.phone && <p className="text-sm text-muted-foreground">{address.phone}</p>}
            </div>}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Payment method</p>
            <p className="font-medium uppercase">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Payment status</p>
            <p className="font-medium capitalize">{order.paymentStatus}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Order status</p>
            <p className="font-medium capitalize">{order.status}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reference</p>
            <p className="font-mono font-medium">{order.paymentRef || "—"}</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Item</th>
                <th className="px-4 py-2.5 text-right font-medium">Qty</th>
                <th className="px-4 py-2.5 text-right font-medium">Unit price</th>
                <th className="px-4 py-2.5 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item, i) => <tr key={i}>
                  <td className="px-4 py-2.5">{item.name}</td>
                  <td className="px-4 py-2.5 text-right">{item.qty}</td>
                  <td className="px-4 py-2.5 text-right">{formatPrice(item.price)}</td>
                  <td className="px-4 py-2.5 text-right font-medium">{formatPrice(item.price * item.qty)}</td>
                </tr>)}
              {items.length === 0 && <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                    No items recorded for this order.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <dl className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Tax</dt>
              <dd>{formatPrice(tax)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 text-base font-bold">
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Thank you for shopping with LUMI Computer. Questions about this order? Contact support@lumicomputer.com.
        </p>
      </Card>
    </div>;
}
