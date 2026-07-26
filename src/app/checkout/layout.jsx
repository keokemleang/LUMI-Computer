import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function CheckoutLayout({
  children
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }
  return children;
}
