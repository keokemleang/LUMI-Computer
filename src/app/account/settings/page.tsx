"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Check,
  Loader2,
  Sun,
  Package,
  Mail,
  GraduationCap,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, notifications, security, and appearance.
        </p>
      </header>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="profile">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileSection />
        </TabsContent>
        <TabsContent value="notifications" className="mt-6">
          <NotificationsSection />
        </TabsContent>
        <TabsContent value="security" className="mt-6">
          <SecuritySection />
        </TabsContent>
        <TabsContent value="appearance" className="mt-6">
          <AppearanceSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileSection() {
  const [name, setName] = React.useState("Sam Student");
  const [email, setEmail] = React.useState("student@example.com");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
      toast.success("Profile updated", {
        description: "Your changes have been saved.",
      });
      window.setTimeout(() => setSaved(false), 2000);
    }, 600);
  }

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>Profile information</CardTitle>
        <CardDescription>
          Update your name and email — these are used across your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Full name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="flex justify-end">
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
                  Save changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function NotificationsSection() {
  const [orderUpdates, setOrderUpdates] = React.useState(true);
  const [newsletter, setNewsletter] = React.useState(true);
  const [courseAnnouncements, setCourseAnnouncements] = React.useState(true);
  const [priceDrops, setPriceDrops] = React.useState(false);

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
      title: "Order updates",
      description: "Get notified when your order status changes.",
      checked: orderUpdates,
      onChange: (v) => {
        setOrderUpdates(v);
        toast.success(`Order updates ${v ? "enabled" : "disabled"}`);
      },
    },
    {
      key: "newsletter",
      icon: Mail,
      title: "Newsletter",
      description: "Monthly digest of new products, projects, and tutorials.",
      checked: newsletter,
      onChange: (v) => {
        setNewsletter(v);
        toast.success(`Newsletter ${v ? "enabled" : "disabled"}`);
      },
    },
    {
      key: "courses",
      icon: GraduationCap,
      title: "Course announcements",
      description: "New lessons, resources, and course recommendations.",
      checked: courseAnnouncements,
      onChange: (v) => {
        setCourseAnnouncements(v);
        toast.success(`Course announcements ${v ? "enabled" : "disabled"}`);
      },
    },
    {
      key: "prices",
      icon: Bell,
      title: "Price drop alerts",
      description: "Be the first to know when wishlist items go on sale.",
      checked: priceDrops,
      onChange: (v) => {
        setPriceDrops(v);
        toast.success(`Price drop alerts ${v ? "enabled" : "disabled"}`);
      },
    },
  ];

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose what updates you want to receive by email.
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

function SecuritySection() {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!current || !next || !confirm) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (next.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setCurrent("");
      setNext("");
      setConfirm("");
      toast.success("Password updated", {
        description: "Use your new password the next time you sign in.",
      });
      window.setTimeout(() => setSaved(false), 2000);
    }, 600);
  }

  return (
    <div className="space-y-4">
      <Card className="gap-0">
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>
            Use a strong, unique password of at least 8 characters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pwd-current">Current password</Label>
              <Input
                id="pwd-current"
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pwd-new">New password</Label>
                <Input
                  id="pwd-new"
                  type="password"
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pwd-confirm">Confirm new password</Label>
                <Input
                  id="pwd-confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving || saved}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating…
                  </>
                ) : saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    Updated
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Update password
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="gap-0">
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2FA is currently <span className="font-medium text-foreground">disabled</span>.
            Enable it to require a verification code at sign-in.
          </p>
          <Button
            variant="outline"
            onClick={() =>
              toast.info("2FA setup is a demo feature", {
                description: "Coming soon to KBSCircuit accounts.",
              })
            }
          >
            Enable 2FA
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AppearanceSection() {
  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how KBSCircuit looks on your device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
              <Sun className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark mode using the toggle in the site
                header.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back to home
            </Link>
          </Button>
        </div>

        <Separator />

        <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          <p>
            Your theme preference is saved automatically to your browser and
            respects your system setting by default.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
