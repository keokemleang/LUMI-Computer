import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(req) {
  const { error } = await requireAdmin();
  if (error) return error;

  const q = new URL(req.url).searchParams.get("q")?.trim().toLowerCase() || "";
  if (q.length < 2) {
    return NextResponse.json({
      ok: true,
      results: []
    });
  }

  const [products, orders, customers] = await Promise.all([db.product.findMany({
    where: {
      OR: [{
        name: {
          contains: q,
          mode: "insensitive"
        }
      }, {
        sku: {
          contains: q,
          mode: "insensitive"
        }
      }]
    },
    take: 5
  }), db.order.findMany({
    where: {
      OR: [{
        orderNo: {
          contains: q,
          mode: "insensitive"
        }
      }, {
        userEmail: {
          contains: q,
          mode: "insensitive"
        }
      }, {
        userName: {
          contains: q,
          mode: "insensitive"
        }
      }]
    },
    take: 5
  }), db.user.findMany({
    where: {
      OR: [{
        email: {
          contains: q,
          mode: "insensitive"
        }
      }, {
        name: {
          contains: q,
          mode: "insensitive"
        }
      }]
    },
    take: 5
  })]);

  const results = [
    ...products.map(p => ({
      type: "product",
      title: p.name,
      desc: `SKU ${p.sku} · $${p.price.toFixed(2)}`,
      href: `/products/${p.slug}`
    })),
    ...orders.map(o => ({
      type: "order",
      title: o.orderNo,
      desc: `${o.userName} · $${o.total.toFixed(2)} · ${o.status}`,
      href: `/invoice/${o.orderNo}`
    })),
    ...customers.map(c => ({
      type: "customer",
      title: c.name || c.email,
      desc: `${c.email} · ${c.role}`,
      href: "/admin/customers"
    }))
  ];

  return NextResponse.json({
    ok: true,
    results
  });
}
