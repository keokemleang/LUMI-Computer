import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Console",
  description: "Manage products, orders, customers, content, and settings.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  const role = (session.user as any).role || "customer";
  if (role !== "admin") {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center py-16">
        <div className="max-w-md text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight">Access restricted</h1>
          <p className="mt-2 text-muted-foreground">
            You need an administrator account to access the KBSCircuit Admin Console.
            Sign in with an admin account to continue.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="outline">
              <Link href="/">Back to store</Link>
            </Button>
            <Button asChild>
              <Link href="/login?callbackUrl=/admin">Sign in as admin</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30">
      <div className="lg:grid lg:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden border-r border-border bg-background lg:block lg:sticky lg:top-0 lg:h-[calc(100vh-0px)]">
          <AdminSidebar />
        </aside>

        {/* Main column */}
        <div className="flex min-h-[calc(100vh-0px)] flex-col">
          <AdminTopbar />
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
