import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { parseJsonBody } from "@/lib/parse-json";
import { slugify } from "@/lib/slug";

export async function POST(req) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { body, errorResponse } = await parseJsonBody(req);
  if (errorResponse) return errorResponse;
  const name = (body?.name || "").trim();
  if (!name) {
    return NextResponse.json({
      ok: false,
      error: "Name is required"
    }, {
      status: 400
    });
  }

  const slug = (body?.slug?.trim() ? slugify(body.slug) : slugify(name)) || `category-${Date.now()}`;

  try {
    const category = await db.category.create({
      data: {
        name,
        slug,
        description: body?.description || null,
        image: body?.image || null,
        featured: !!body?.featured
      }
    });
    return NextResponse.json({
      ok: true,
      category
    });
  } catch (err) {
    if (err?.code === "P2002") {
      return NextResponse.json({
        ok: false,
        error: "A category with that slug already exists"
      }, {
        status: 409
      });
    }
    return NextResponse.json({
      ok: false,
      error: "Failed to create category"
    }, {
      status: 500
    });
  }
}
