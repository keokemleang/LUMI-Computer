"use client";

import * as React from "react";
import {
  Store,
  CreditCard,
  Truck,
  Bell,
  Save,
  Check,
  Loader2,
  Package,
  Mail,
  GraduationCap,
  Megaphone,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  return (
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
  );
}

function SaveButton({
  saving,
  saved,
  label = "Save changes",
}: {
  saving: boolean;
  saved: boolean;
  label?: string;
}) {
  return (
    <Button type="submit" disabled={saving || saved}>
      {saving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving…
        </>
      ) : saved ? (
        <>
          <Check className="h-4 w-4" />
          Saved
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}

function useFakeSave() {
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  function save(title: string, description?: string) {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
      toast.success(title, { description });
      window.setTimeout(() => setSaved(false), 2000);
    }, 600);
  }

  return { saving, saved, save };
}

function GeneralSection() {
  const { saving, saved, save } = useFakeSave();
  const [storeName, setStoreName] = React.useState("KBSCircuit");
  const [supportEmail, setSupportEmail] = React.useState("support@kbscircuit.com");
  const [currency, setCurrency] = React.useState("usd");
  const [timezone, setTimezone] = React.useState("utc-8");

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>Store details</CardTitle>
        <CardDescription>
          Basic information about your store shown to customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save("Store settings saved", "General settings updated successfully.");
          }}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="store-name">Store name</Label>
              <Input
                id="store-name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="support-email">Support email</Label>
              <Input
                id="support-email"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
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
    </Card>
  );
}

function PaymentsSection() {
  const { saving, saved, save } = useFakeSave();
  const [publishable, setPublishable] = React.useState("pk_test_••••••••••••••••");
  const [secret, setSecret] = React.useState("sk_test_••••••••••••••••");
  const [webhook, setWebhook] = React.useState("whsec_••••••••••••");

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>Payment provider</CardTitle>
        <CardDescription>
          Connect Stripe to accept payments. Keys are stored securely.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save("Payment settings saved", "Stripe credentials updated.");
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="pk">Publishable key</Label>
            <Input
              id="pk"
              value={publishable}
              onChange={(e) => setPublishable(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sk">Secret key</Label>
            <Input
              id="sk"
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wh">Webhook signing secret</Label>
            <Input
              id="wh"
              type="password"
              value={webhook}
              onChange={(e) => setWebhook(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <Separator />

          <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Test mode</p>
            <p className="mt-0.5">
              Your store is currently in test mode — no real charges will be made.
            </p>
          </div>

          <div className="flex justify-end">
            <SaveButton saving={saving} saved={saved} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ShippingSection() {
  const { saving, saved, save } = useFakeSave();
  const [freeThreshold, setFreeThreshold] = React.useState("50");
  const [flatRate, setFlatRate] = React.useState("5.99");
  const [enableFreeShip, setEnableFreeShip] = React.useState(true);
  const [international, setInternational] = React.useState(false);

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>Shipping rates</CardTitle>
        <CardDescription>
          Define how shipping is calculated at checkout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save("Shipping settings saved", "Rates updated successfully.");
          }}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="flat">Flat rate (USD)</Label>
              <Input
                id="flat"
                value={flatRate}
                onChange={(e) => setFlatRate(e.target.value)}
                inputMode="decimal"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="free">Free shipping threshold (USD)</Label>
              <Input
                id="free"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(e.target.value)}
                inputMode="decimal"
                disabled={!enableFreeShip}
              />
            </div>
          </div>

          <ul className="divide-y divide-border rounded-lg border border-border">
            <ToggleRow
              icon={Truck}
              title="Enable free shipping over threshold"
              description="Waive shipping for orders above the threshold."
              checked={enableFreeShip}
              onChange={(v) => {
                setEnableFreeShip(v);
                toast.success(`Free shipping ${v ? "enabled" : "disabled"}`);
              }}
            />
            <ToggleRow
              icon={Package}
              title="International shipping"
              description="Allow orders to be shipped outside your default country."
              checked={international}
              onChange={(v) => {
                setInternational(v);
                toast.success(`International shipping ${v ? "enabled" : "disabled"}`);
              }}
            />
          </ul>

          <div className="flex justify-end">
            <SaveButton saving={saving} saved={saved} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function NotificationsSection() {
  const [orderUpdates, setOrderUpdates] = React.useState(true);
  const [newsletter, setNewsletter] = React.useState(true);
  const [courseAnnouncements, setCourseAnnouncements] = React.useState(false);
  const [marketing, setMarketing] = React.useState(true);

  const items: {
    key: string;
    icon: typeof Package;
    title: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }[] = [
    {
      key: "orders",
      icon: Package,
      title: "New order notifications",
      description: "Email the admin when a new order is placed.",
      checked: orderUpdates,
      onChange: (v) => {
        setOrderUpdates(v);
        toast.success(`Order notifications ${v ? "enabled" : "disabled"}`);
      },
    },
    {
      key: "newsletter",
      icon: Mail,
      title: "Newsletter signups",
      description: "Get notified when someone subscribes to the newsletter.",
      checked: newsletter,
      onChange: (v) => {
        setNewsletter(v);
        toast.success(`Newsletter alerts ${v ? "enabled" : "disabled"}`);
      },
    },
    {
      key: "courses",
      icon: GraduationCap,
      title: "Course enrollments",
      description: "Notify when a customer enrolls in a paid course.",
      checked: courseAnnouncements,
      onChange: (v) => {
        setCourseAnnouncements(v);
        toast.success(`Course alerts ${v ? "enabled" : "disabled"}`);
      },
    },
    {
      key: "marketing",
      icon: Megaphone,
      title: "Marketing campaigns",
      description: "Weekly summary of new signups, orders, and reviews.",
      checked: marketing,
      onChange: (v) => {
        setMarketing(v);
        toast.success(`Marketing digest ${v ? "enabled" : "disabled"}`);
      },
    },
  ];

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose which events trigger an admin email.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.key}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
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
                <Switch
                  checked={item.checked}
                  onCheckedChange={item.onChange}
                  aria-label={item.title}
                />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: typeof Package;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3">
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
    </li>
  );
}
