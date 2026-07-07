import { getAdminOrders, parseJson } from "@/lib/data";
import { OrdersView, type AdminOrderLite } from "./orders-view";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  const lite: AdminOrderLite[] = orders.map((o) => ({
    id: o.id,
    orderNo: o.orderNo,
    userName: o.userName,
    userEmail: o.userEmail,
    total: o.total,
    status: o.status,
    items: parseJson<{ name: string; qty: number; price: number }[]>(o.items, []),
    createdAt: o.createdAt.toISOString(),
  }));

  return <OrdersView orders={lite} />;
}
