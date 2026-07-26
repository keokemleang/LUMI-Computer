import { getAdminOrders, parseJson } from "@/lib/data";
import { OrdersView } from "./orders-view";
export const metadata = {
  title: "Orders"
};
export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
  const lite = orders.map(o => ({
    id: o.id,
    orderNo: o.orderNo,
    userName: o.userName,
    userEmail: o.userEmail,
    total: o.total,
    status: o.status,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    shippingAddress: parseJson(o.shippingAddress, null),
    items: parseJson(o.items, []),
    createdAt: o.createdAt.toISOString()
  }));
  return <OrdersView orders={lite} />;
}
