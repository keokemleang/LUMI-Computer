import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { AccountSidebar } from "./account-sidebar";
import { initialsFromName } from "@/lib/password-rules";
export default async function AccountLayout({
  children
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }
  const user = {
    name: session.user.name || null,
    email: session.user.email || null,
    image: session.user.image || null,
    initials: initialsFromName(session.user.name, session.user.email),
    role: session.user.role || "customer"
  };
  return <div className="container-page py-6 md:py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
        My Account
      </h1>
      <p className="mt-2 text-muted-foreground">
        Manage your orders, addresses, wishlist, and account settings.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <AccountSidebar user={user} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>;
}
