import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim().toLowerCase() || "";
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const [products, projects, courses, downloads, posts] = await Promise.all([
    db.product.findMany({
      where: { OR: [{ name: { contains: q } }, { shortDesc: { contains: q } }, { sku: { contains: q } }] },
      take: 5,
    }),
    db.project.findMany({
      where: { OR: [{ title: { contains: q } }, { overview: { contains: q } }] },
      take: 5,
    }),
    db.course.findMany({
      where: { OR: [{ title: { contains: q } }, { description: { contains: q } }] },
      take: 5,
    }),
    db.download.findMany({
      where: { OR: [{ title: { contains: q } }, { description: { contains: q } }] },
      take: 5,
    }),
    db.blogPost.findMany({
      where: { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }] },
      take: 5,
    }),
  ]);

  const results = [
    ...products.map((p) => ({ type: "product" as const, title: p.name, desc: p.shortDesc, href: `/products/${p.slug}` })),
    ...projects.map((p) => ({ type: "project" as const, title: p.title, desc: p.overview, href: `/projects/${p.slug}` })),
    ...courses.map((c) => ({ type: "course" as const, title: c.title, desc: c.description, href: `/courses/${c.slug}` })),
    ...downloads.map((d) => ({ type: "download" as const, title: d.title, desc: d.description, href: `/downloads` })),
    ...posts.map((b) => ({ type: "blog" as const, title: b.title, desc: b.excerpt, href: `/blog/${b.slug}` })),
  ];

  return NextResponse.json({ results });
}
