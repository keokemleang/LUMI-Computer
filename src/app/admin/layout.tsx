import type { Metadata } from "next";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";

export const metadata: Metadata = {
  title: "Admin Console",
  description: "Manage products, orders, customers, content, and settings.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
