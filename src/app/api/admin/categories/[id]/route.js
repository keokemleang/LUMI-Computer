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
  if (body.description !== undefined) data.description = body.description || null;
  if (body.image !== undefined) data.image = body.image || null;
  if (body.featured !== undefined) data.featured = !!body.featured;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({
      ok: false,
      error: "Nothing to update"
    }, {
      status: 400
    });
  }

  try {
    const category = await db.category.update({
      where: {
        id
      },
      data
    });
    return NextResponse.json({
      ok: true,
      category
    });
  } catch (err) {
    if (err?.code === "P2025") {
      return NextResponse.json({
        ok: false,
        error: "Category not found"
      }, {
        status: 404
      });
    }
    return NextResponse.json({
      ok: false,
      error: "Failed to update category"
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

  const productCount = await db.product.count({
    where: {
      categoryId: id
    }
  });
  if (productCount > 0) {
    return NextResponse.json({
      ok: false,
      error: `Can't delete — ${productCount} product${productCount === 1 ? "" : "s"} still use this category`
    }, {
      status: 409
    });
  }

  try {
    await db.category.delete({
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
        error: "Category not found"
      }, {
        status: 404
      });
    }
    return NextResponse.json({
      ok: false,
      error: "Failed to delete category"
    }, {
      status: 500
    });
  }
}
