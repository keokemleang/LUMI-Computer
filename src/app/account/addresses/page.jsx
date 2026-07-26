"use client";

import * as React from "react";
import { MapPin, Plus, Pencil, Trash2, Check, Home, Briefcase, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
const labelIcon = {
  Home,
  Work: Briefcase,
  Other: MapPin
};
export default function AddressesPage() {
  const [addresses, setAddresses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);

  const loadAddresses = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/addresses");
      const data = await res.json();
      if (data.ok) setAddresses(data.addresses);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(addr) {
    setEditing(addr);
    setDialogOpen(true);
  }

  async function handleSave(values) {
    const url = editing ? `/api/account/addresses/${editing.id}` : "/api/account/addresses";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Failed to save address");
      return false;
    }
    toast.success(editing ? "Address updated" : "Address added");
    await loadAddresses();
    return true;
  }

  async function handleRemove(id) {
    const res = await fetch(`/api/account/addresses/${id}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Failed to remove address");
      return;
    }
    toast.success("Address removed");
    await loadAddresses();
  }

  async function handleSetDefault(id) {
    const res = await fetch(`/api/account/addresses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        isDefault: true
      })
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Failed to update default address");
      return;
    }
    toast.success("Default address updated");
    await loadAddresses();
  }

  return <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Addresses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage shipping and billing addresses for your orders.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add new address
        </Button>
      </header>

      {loading ? <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div> : <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map(addr => {
        const Icon = labelIcon[addr.label] || MapPin;
        return <Card key={addr.id} className="gap-0 p-5">
                <CardHeader className="flex-row items-center justify-between p-0">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    {addr.label}
                  </CardTitle>
                  {addr.isDefault && <Badge className="bg-success text-success-foreground">
                      <Check className="h-3 w-3" />
                      Default
                    </Badge>}
                </CardHeader>
                <CardContent className="p-0">
                  <div className="mt-4 space-y-1 text-sm">
                    <p className="font-semibold">{addr.name}</p>
                    <p className="text-muted-foreground">{addr.street}</p>
                    <p className="text-muted-foreground">
                      {addr.city}
                      {addr.zip ? ` ${addr.zip}` : ""}, {addr.country}
                    </p>
                    {addr.phone && <p className="text-muted-foreground">{addr.phone}</p>}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(addr)}>
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    {!addr.isDefault && <>
                        <Button variant="ghost" size="sm" onClick={() => handleSetDefault(addr.id)}>
                          Set as default
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => handleRemove(addr.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </Button>
                      </>}
                    {addr.isDefault && addresses.length > 1 && <span className="text-xs text-muted-foreground">
                        Cannot remove the default address
                      </span>}
                  </div>
                </CardContent>
              </Card>;
      })}

          {/* Add new card slot */}
          <button type="button" onClick={openCreate} className={cn("flex h-full min-h-44 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-accent hover:text-foreground")}>
            <Plus className="h-6 w-6" />
            Add new address
          </button>

          {addresses.length === 0 && <p className="col-span-full py-4 text-center text-sm text-muted-foreground">
              No addresses saved yet.
            </p>}
        </div>}

      <AddressDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSave} initial={editing} />
    </div>;
}
function AddressDialog({
  open,
  onOpenChange,
  onSubmit,
  initial
}) {
  const [name, setName] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [city, setCity] = React.useState("");
  const [zip, setZip] = React.useState("");
  const [country, setCountry] = React.useState("Cambodia");
  const [phone, setPhone] = React.useState("");
  const [label, setLabel] = React.useState("Home");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setStreet(initial?.street || "");
      setCity(initial?.city || "");
      setZip(initial?.zip || "");
      setCountry(initial?.country || "Cambodia");
      setPhone(initial?.phone || "");
      setLabel(initial?.label || "Home");
    }
  }, [open, initial]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !street.trim() || !city.trim() || !country.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    const ok = await onSubmit({
      name: name.trim(),
      street: street.trim(),
      city: city.trim(),
      country: country.trim(),
      zip: zip.trim(),
      phone: phone.trim(),
      label
    });
    setSubmitting(false);
    if (ok) onOpenChange(false);
  }

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit address" : "Add a new address"}</DialogTitle>
          <DialogDescription>
            Use this address for shipping or billing on future orders.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="addr-name">Full name *</Label>
            <Input id="addr-name" value={name} onChange={e => setName(e.target.value)} placeholder="Sam Student" autoComplete="name" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addr-street">Street address *</Label>
            <Input id="addr-street" value={street} onChange={e => setStreet(e.target.value)} placeholder="123 Maker Lane" autoComplete="address-line1" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="addr-city">City *</Label>
              <Input id="addr-city" value={city} onChange={e => setCity(e.target.value)} placeholder="Phnom Penh" autoComplete="address-level2" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-zip">ZIP / Postal</Label>
              <Input id="addr-zip" value={zip} onChange={e => setZip(e.target.value)} placeholder="120101" autoComplete="postal-code" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="addr-country">Country *</Label>
              <Input id="addr-country" value={country} onChange={e => setCountry(e.target.value)} placeholder="Cambodia" autoComplete="country-name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-phone">Phone</Label>
              <Input id="addr-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+855 23 000 000" autoComplete="tel" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Label</Label>
            <div className="flex gap-2">
              {["Home", "Work", "Other"].map(l => {
              const Icon = labelIcon[l];
              const active = label === l;
              return <button key={l} type="button" onClick={() => setLabel(l)} aria-pressed={active} className={cn("inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors", active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent hover:text-foreground")}>
                    <Icon className="h-3.5 w-3.5" />
                    {l}
                  </button>;
            })}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </> : <>
                  <Check className="h-4 w-4" />
                  Save address
                </>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>;
}
