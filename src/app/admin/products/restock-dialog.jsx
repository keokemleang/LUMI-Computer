"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, PackagePlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function RestockDialog({
  open,
  onOpenChange,
  product
}) {
  const router = useRouter();
  const [amount, setAmount] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) setAmount("");
  }, [open, product]);

  const currentStock = product?.stock ?? 0;
  const parsedAmount = Number(amount);
  const newStock = Number.isFinite(parsedAmount) ? currentStock + parsedAmount : currentStock;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!product) return;
    if (!amount || !Number.isFinite(parsedAmount)) {
      toast.error("Enter a quantity to add");
      return;
    }
    if (newStock < 0) {
      toast.error("Resulting stock can't be negative");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          stock: newStock
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error || "Failed to restock");
        return;
      }
      toast.success(`Restocked ${product.name}`, {
        description: `${currentStock} → ${newStock} units`
      });
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setSaving(false);
    }
  }

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Restock</DialogTitle>
          <DialogDescription>
            {product ? `Add units to ${product.name}.` : ""}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
            <span className="text-muted-foreground">Current stock: </span>
            <span className="font-semibold">{currentStock}</span>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="restock-amount">Units to add</Label>
            <Input id="restock-amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 25" inputMode="numeric" autoFocus />
          </div>
          {amount && Number.isFinite(parsedAmount) && <p className="text-sm text-muted-foreground">
              New stock will be <span className="font-semibold text-foreground">{newStock}</span> units.
            </p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackagePlus className="h-4 w-4" />}
              Restock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>;
}
