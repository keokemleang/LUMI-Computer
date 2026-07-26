import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";

function formatPrice(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function CheckoutSuccessPage({ searchParams }) {
  const { ref } = await searchParams;
  const order = ref ? await db.order.findUnique({ where: { paymentRef: ref } }) : null;

  return (
    <div className="container-page flex flex-col items-center justify-center py-16 text-center">
      <Card className="w-full max-w-md gap-0 p-8">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">
          {order?.paymentStatus === "paid" ? "Payment received!" : "Order placed"}
        </h1>
        {order ? (
          <>
            <p className="mt-2 text-muted-foreground">
              Thanks, {order.userName}. Your order{" "}
              <span className="font-mono font-medium text-foreground">{order.orderNo}</span> is confirmed.
            </p>
            <p className="mt-4 text-xl font-bold">{formatPrice(order.total)}</p>
          </>
        ) : (
          <p className="mt-2 text-muted-foreground">We couldn&apos;t find that order — check your email for confirmation.</p>
        )}
        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          {order && (
            <Button asChild variant="outline" className="w-full">
              <Link href={`/invoice/${order.orderNo}`}>View invoice</Link>
            </Button>
          )}
          <Button asChild className="w-full">
            <Link href="/products">Continue shopping</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
