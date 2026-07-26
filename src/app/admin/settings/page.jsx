"use client";

import * as React from "react";
import { Store, CreditCard, Truck, Bell, Save, Check, Loader2, Package, Mail, Megaphone, QrCode, Banknote, Cloud } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const SettingsContext = React.createContext(null);

function useSettingsData() {
  const [settings, setSettings] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const reload = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.ok) setSettings(data.settings);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    reload();
  }, [reload]);

  async function save(patch, successMessage) {
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patch)
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Failed to save settings");
      return false;
    }
    setSettings(data.settings);
    toast.success(successMessage);
    return true;
  }

  return {
    settings,
    loading,
    save
  };
}

export default function AdminSettingsPage() {
  const state = useSettingsData();
  return <SettingsContext.Provider value={state}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure your store, payments, shipping, and notifications.
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="general">
              <Store className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="shipping">
              <Truck className="h-4 w-4" />
              Shipping
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <GeneralSection />
          </TabsContent>
          <TabsContent value="payments" className="mt-6">
            <PaymentsSection />
          </TabsContent>
          <TabsContent value="shipping" className="mt-6">
            <ShippingSection />
          </TabsContent>
          <TabsContent value="notifications" className="mt-6">
            <NotificationsSection />
          </TabsContent>
        </Tabs>
      </div>
    </SettingsContext.Provider>;
}

function SaveButton({
  saving,
  saved,
  label = "Save changes"
}) {
  return <Button type="submit" disabled={saving || saved}>
      {saving ? <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving…
        </> : saved ? <>
          <Check className="h-4 w-4" />
          Saved
        </> : <>
          <Save className="h-4 w-4" />
          {label}
        </>}
    </Button>;
}

function LoadingCard() {
  return <div className="flex justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>;
}

function GeneralSection() {
  const { settings, loading, save } = React.useContext(SettingsContext);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [storeName, setStoreName] = React.useState("");
  const [supportEmail, setSupportEmail] = React.useState("");
  const [currency, setCurrency] = React.useState("usd");
  const [timezone, setTimezone] = React.useState("utc-8");

  React.useEffect(() => {
    if (settings) {
      setStoreName(settings.storeName);
      setSupportEmail(settings.supportEmail);
      setCurrency(settings.currency);
      setTimezone(settings.timezone);
    }
  }, [settings]);

  if (loading || !settings) return <LoadingCard />;

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const ok = await save({
      storeName,
      supportEmail,
      currency,
      timezone
    }, "Store settings saved");
    setSaving(false);
    if (ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    }
  }

  return <Card className="gap-0">
      <CardHeader>
        <CardTitle>Store details</CardTitle>
        <CardDescription>
          Basic information about your store shown to customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="store-name">Store name</Label>
              <Input id="store-name" value={storeName} onChange={e => setStoreName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="support-email">Support email</Label>
              <Input id="support-email" type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD — US Dollar ($)</SelectItem>
                  <SelectItem value="eur">EUR — Euro (€)</SelectItem>
                  <SelectItem value="gbp">GBP — British Pound (£)</SelectItem>
                  <SelectItem value="khr">KHR — Cambodian Riel (៛)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc-8">UTC-8 — Pacific</SelectItem>
                  <SelectItem value="utc-5">UTC-5 — Eastern</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="utc+7">UTC+7 — Indochina</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <SaveButton saving={saving} saved={saved} />
          </div>
        </form>
      </CardContent>
    </Card>;
}

function PaymentsSection() {
  const [status, setStatus] = React.useState(null);
  React.useEffect(() => {
    fetch("/api/admin/payment-status").then(res => res.json()).then(data => {
      if (data.ok) setStatus(data);
    });
  }, []);

  return <div className="space-y-4">
      <Card className="gap-0">
        <CardHeader>
          <CardTitle>Payment methods</CardTitle>
          <CardDescription>
            LUMI Computer accepts KHQR (Bakong) and Cash on Delivery. Payment provider credentials
            are configured via environment variables, not stored in the database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border rounded-lg border border-border">
            <li className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                  <QrCode className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">KHQR (Bakong) via CamRapidPay</p>
                  <p className="text-sm text-muted-foreground">Instant QR payment, all Bakong-connected banks.</p>
                </div>
              </div>
              {status === null ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : status.khqrConfigured ? <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                  <Check className="h-3 w-3" /> Configured
                </span> : <span className="inline-flex items-center rounded-md bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive">
                  Not configured
                </span>}
            </li>
            <li className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                  <Banknote className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">No setup required — always available at checkout.</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                <Check className="h-3 w-3" /> Active
              </span>
            </li>
          </ul>
          {status && !status.khqrConfigured && <p className="mt-4 text-sm text-muted-foreground">
              Add <code className="rounded bg-muted px-1 py-0.5">CAMRAPIDPAY_API_KEY</code> to your environment
              variables to enable KHQR payments.
            </p>}
        </CardContent>
      </Card>

      <Card className="gap-0">
        <CardHeader>
          <CardTitle>Media storage</CardTitle>
          <CardDescription>Product and category image uploads.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                <Cloud className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium">Cloudinary</p>
                <p className="text-sm text-muted-foreground">Used for admin image uploads.</p>
              </div>
            </div>
            {status === null ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : status.cloudinaryConfigured ? <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                <Check className="h-3 w-3" /> Configured
              </span> : <span className="inline-flex items-center rounded-md bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive">
                Not configured
              </span>}
          </div>
        </CardContent>
      </Card>
    </div>;
}

function ShippingSection() {
  const { settings, loading, save } = React.useContext(SettingsContext);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [freeThreshold, setFreeThreshold] = React.useState("50");
  const [flatRate, setFlatRate] = React.useState("5.99");
  const [enableFreeShip, setEnableFreeShip] = React.useState(true);
  const [international, setInternational] = React.useState(false);

  React.useEffect(() => {
    if (settings) {
      setFreeThreshold(String(settings.freeShippingThreshold));
      setFlatRate(String(settings.flatShippingRate));
      setEnableFreeShip(settings.enableFreeShipping);
      setInternational(settings.internationalShipping);
    }
  }, [settings]);

  if (loading || !settings) return <LoadingCard />;

  async function handleSubmit(e) {
    e.preventDefault();
    const flat = Number(flatRate);
    const free = Number(freeThreshold);
    if (!Number.isFinite(flat) || flat < 0 || !Number.isFinite(free) || free < 0) {
      toast.error("Enter valid, non-negative amounts");
      return;
    }
    setSaving(true);
    const ok = await save({
      flatShippingRate: flat,
      freeShippingThreshold: free,
      enableFreeShipping: enableFreeShip,
      internationalShipping: international
    }, "Shipping settings saved — rates now apply at checkout");
    setSaving(false);
    if (ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    }
  }

  async function toggleFreeShip(v) {
    setEnableFreeShip(v);
    await save({
      enableFreeShipping: v
    }, `Free shipping ${v ? "enabled" : "disabled"}`);
  }
  async function toggleInternational(v) {
    setInternational(v);
    await save({
      internationalShipping: v
    }, `International shipping ${v ? "enabled" : "disabled"}`);
  }

  return <Card className="gap-0">
      <CardHeader>
        <CardTitle>Shipping rates</CardTitle>
        <CardDescription>
          These rates apply immediately to the cart, checkout, and any new order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="flat">Flat rate (USD)</Label>
              <Input id="flat" value={flatRate} onChange={e => setFlatRate(e.target.value)} inputMode="decimal" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="free">Free shipping threshold (USD)</Label>
              <Input id="free" value={freeThreshold} onChange={e => setFreeThreshold(e.target.value)} inputMode="decimal" disabled={!enableFreeShip} />
            </div>
          </div>

          <ul className="divide-y divide-border rounded-lg border border-border">
            <ToggleRow icon={Truck} title="Enable free shipping over threshold" description="Waive shipping for orders above the threshold." checked={enableFreeShip} onChange={toggleFreeShip} />
            <ToggleRow icon={Package} title="International shipping" description="Allow orders to be shipped outside your default country." checked={international} onChange={toggleInternational} />
          </ul>

          <div className="flex justify-end">
            <SaveButton saving={saving} saved={saved} label="Save rates" />
          </div>
        </form>
      </CardContent>
    </Card>;
}

function NotificationsSection() {
  const { settings, loading, save } = React.useContext(SettingsContext);
  if (loading || !settings) return <LoadingCard />;

  async function toggle(key, label) {
    await save({
      [key]: !settings[key]
    }, `${label} ${!settings[key] ? "enabled" : "disabled"}`);
  }

  const items = [{
    key: "notifyNewOrder",
    icon: Package,
    title: "New order notifications",
    description: "Email the admin when a new order is placed."
  }, {
    key: "notifyNewsletter",
    icon: Mail,
    title: "Newsletter signups",
    description: "Get notified when someone subscribes to the newsletter."
  }, {
    key: "notifyMarketing",
    icon: Megaphone,
    title: "Marketing campaigns",
    description: "Weekly summary of new signups, orders, and reviews."
  }];

  return <Card className="gap-0">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose which events trigger an admin email. Preferences are saved, though sending these
          emails requires an email provider to be wired up separately.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {items.map(item => {
          const Icon = item.icon;
          return <li key={item.key} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
                <Switch checked={settings[item.key]} onCheckedChange={() => toggle(item.key, item.title)} aria-label={item.title} />
              </li>;
        })}
        </ul>
      </CardContent>
    </Card>;
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange
}) {
  return <li className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={title} />
    </li>;
}
