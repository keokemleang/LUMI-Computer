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
  const sku = (body?.sku || "").trim();
  const categoryId = body?.categoryId || "";
  const price = Number(body?.price);

  if (!name || !sku || !categoryId || !Number.isFinite(price)) {
    return NextResponse.json({
      ok: false,
      error: "Name, SKU, category, and a valid price are required"
    }, {
      status: 400
    });
  }

  const slug = (body?.slug?.trim() ? slugify(body.slug) : slugify(name)) || `product-${Date.now()}`;

  try {
    const product = await db.product.create({
      data: {
        name,
        slug,
        brand: body?.brand || null,
        sku,
        shortDesc: body?.shortDesc || "",
        description: body?.description || "",
        price,
        compareAt: body?.compareAt ? Number(body.compareAt) : null,
        stock: Number.isFinite(Number(body?.stock)) ? Number(body.stock) : 0,
        categoryId,
        images: JSON.stringify(Array.isArray(body?.images) ? body.images : []),
        specs: JSON.stringify(Array.isArray(body?.specs) ? body.specs : []),
        featured: !!body?.featured
      }
    });
    return NextResponse.json({
      ok: true,
      product
    });
  } catch (err) {
    if (err?.code === "P2002") {
      return NextResponse.json({
        ok: false,
        error: "A product with that slug or SKU already exists"
      }, {
        status: 409
      });
    }
    if (err?.code === "P2003") {
      return NextResponse.json({
        ok: false,
        error: "Selected category does not exist"
      }, {
        status: 400
      });
    }
    return NextResponse.json({
      ok: false,
      error: "Failed to create product"
    }, {
      status: 500
    });
  }
}
