import { Mail, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminCustomers } from "@/lib/data";
import { RowActions } from "../row-actions";
import { MobileRowActions } from "../mobile-row-actions";
import { ROLE_BADGE, formatDate } from "../helpers";
export const metadata = {
  title: "Customers"
};
function initials(name) {
  if (!name) return "U";
  return name.split(" ").map(p => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}
export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();
  return <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everyone with a LUMI Computer account.
        </p>
      </div>

      <Card className="gap-0 p-0">
        <CardContent className="px-0">
          {/* Mobile: card list */}
          <div className="space-y-3 px-4 py-4 sm:hidden">
            {customers.map(u => <div key={u.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {initials(u.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">
                        {u.name ?? "Unnamed"}
                      </p>
                      <span className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${ROLE_BADGE[u.role] ?? "bg-muted text-muted-foreground border-border"}`}>
                        {u.role}
                      </span>
                    </div>
                    <p className="mt-0.5 inline-flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {u.email}
                    </p>
                  </div>
                </div>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Joined {formatDate(u.createdAt)}
                </p>
                <MobileRowActions itemName={u.name ?? u.email} />
              </div>)}
            {customers.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">
                No customers yet.
              </p>}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block">
            <div className="scroll-area-thin overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Joined</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map(u => <TableRow key={u.id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                            {initials(u.name)}
                          </span>
                          <span className="text-sm font-medium">
                            {u.name ?? "Unnamed"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          {u.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${ROLE_BADGE[u.role] ?? "bg-muted text-muted-foreground border-border"}`}>
                          {u.role}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(u.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <RowActions itemName={u.name ?? u.email} />
                      </TableCell>
                    </TableRow>)}
                  {customers.length === 0 && <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                        No customers yet.
                      </TableCell>
                    </TableRow>}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}
