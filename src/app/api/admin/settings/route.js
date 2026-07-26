import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { getSettings } from "@/lib/settings";
import { parseJsonBody } from "@/lib/parse-json";

const EDITABLE_FIELDS = ["storeName", "supportEmail", "currency", "timezone", "flatShippingRate", "freeShippingThreshold", "enableFreeShipping", "internationalShipping", "notifyNewOrder", "notifyNewsletter", "notifyMarketing", "heroImage1", "heroImage2"];

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const settings = await getSettings();
  return NextResponse.json({
    ok: true,
    settings
  });
}

export async function PATCH(req) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { body, errorResponse } = await parseJsonBody(req);
  if (errorResponse) return errorResponse;
  const data = {};
  for (const key of EDITABLE_FIELDS) {
    if (body[key] === undefined) continue;
    if (key === "flatShippingRate" || key === "freeShippingThreshold") {
      const num = Number(body[key]);
      if (!Number.isFinite(num) || num < 0) {
        return NextResponse.json({
          ok: false,
          error: `Invalid value for ${key}`
        }, {
          status: 400
        });
      }
      data[key] = num;
    } else if (key === "enableFreeShipping" || key === "internationalShipping" || key === "notifyNewOrder" || key === "notifyNewsletter" || key === "notifyMarketing") {
      data[key] = !!body[key];
    } else {
      data[key] = String(body[key]);
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({
      ok: false,
      error: "Nothing to update"
    }, {
      status: 400
    });
  }

  const settings = await db.settings.upsert({
    where: {
      id: "default"
    },
    update: data,
    create: {
      id: "default",
      ...data
    }
  });

  return NextResponse.json({
    ok: true,
    settings
  });
}
