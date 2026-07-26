import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req) {
  const limited = rateLimit(req, { key: "search", limit: 40, windowMs: 60_000 });
  if (limited) return limited;

  const q = req.nextUrl.searchParams.get("q")?.trim().toLowerCase() || "";
  if (q.length < 2) {
    return NextResponse.json({
      results: []
    });
  }
  const products = await db.product.findMany({
    where: {
      OR: [{
        name: {
          contains: q,
          mode: "insensitive"
        }
      }, {
        shortDesc: {
          contains: q,
          mode: "insensitive"
        }
      }, {
        sku: {
          contains: q,
          mode: "insensitive"
        }
      }, {
        brand: {
          contains: q,
          mode: "insensitive"
        }
      }]
    },
    take: 8
  });
  const results = products.map(p => ({
    type: "product",
    title: p.name,
    desc: p.shortDesc,
    href: `/products/${p.slug}`
  }));
  return NextResponse.json({
    results
  });
}
