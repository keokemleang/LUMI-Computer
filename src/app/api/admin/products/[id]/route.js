import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { parseJsonBody } from "@/lib/parse-json";

export async function PATCH(req, {
  params
}) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { body, errorResponse } = await parseJsonBody(req);
  if (errorResponse) return errorResponse;
  const data = {};

  if (body.name !== undefined) data.name = String(body.name).trim();
  if (body.brand !== undefined) data.brand = body.brand || null;
  if (body.sku !== undefined) data.sku = String(body.sku).trim();
  if (body.shortDesc !== undefined) data.shortDesc = body.shortDesc;
  if (body.description !== undefined) data.description = body.description;
  if (body.categoryId !== undefined) data.categoryId = body.categoryId;
  if (body.featured !== undefined) data.featured = !!body.featured;
  if (body.images !== undefined) data.images = JSON.stringify(Array.isArray(body.images) ? body.images : []);
  if (body.specs !== undefined) data.specs = JSON.stringify(Array.isArray(body.specs) ? body.specs : []);
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price)) {
      return NextResponse.json({
        ok: false,
        error: "Invalid price"
      }, {
        status: 400
      });
    }
    data.price = price;
  }
  if (body.compareAt !== undefined) {
    data.compareAt = body.compareAt === "" || body.compareAt === null ? null : Number(body.compareAt);
  }
  if (body.stock !== undefined) {
    const stock = Number(body.stock);
    if (!Number.isFinite(stock) || stock < 0) {
      return NextResponse.json({
        ok: false,
        error: "Invalid stock quantity"
      }, {
        status: 400
      });
    }
    data.stock = Math.round(stock);
  }

  try {
    const product = await db.product.update({
      where: {
        id
      },
      data
    });
    return NextResponse.json({
      ok: true,
      product
    });
  } catch (err) {
    if (err?.code === "P2025") {
      return NextResponse.json({
        ok: false,
        error: "Product not found"
      }, {
        status: 404
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
      error: "Failed to update product"
    }, {
      status: 500
    });
  }
}

export async function DELETE(req, {
  params
}) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  try {
    await db.product.delete({
      where: {
        id
      }
    });
    return NextResponse.json({
      ok: true
    });
  } catch (err) {
    if (err?.code === "P2025") {
      return NextResponse.json({
        ok: false,
        error: "Product not found"
      }, {
        status: 404
      });
    }
    if (err?.code === "P2003") {
      return NextResponse.json({
        ok: false,
        error: "Can't delete — this product still has reviews"
      }, {
        status: 409
      });
    }
    return NextResponse.json({
      ok: false,
      error: "Failed to delete product"
    }, {
      status: 500
    });
  }
}
