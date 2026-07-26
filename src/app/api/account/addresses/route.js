import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { parseJsonBody } from "@/lib/parse-json";

export async function GET() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({
      ok: false,
      error: "Unauthorized"
    }, {
      status: 401
    });
  }
  const addresses = await db.address.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: [{
      isDefault: "desc"
    }, {
      createdAt: "desc"
    }]
  });
  return NextResponse.json({
    ok: true,
    addresses
  });
}

export async function POST(req) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({
      ok: false,
      error: "Unauthorized"
    }, {
      status: 401
    });
  }

  const { body, errorResponse } = await parseJsonBody(req);
  if (errorResponse) return errorResponse;
  const name = String(body?.name || "").trim();
  const street = String(body?.street || "").trim();
  const city = String(body?.city || "").trim();
  const country = String(body?.country || "").trim();
  const zip = String(body?.zip || "").trim();
  const phone = String(body?.phone || "").trim();
  const label = ["Home", "Work", "Other"].includes(body?.label) ? body.label : "Home";

  if (!name || !street || !city || !country) {
    return NextResponse.json({
      ok: false,
      error: "Please fill in all required fields"
    }, {
      status: 400
    });
  }

  const existingCount = await db.address.count({
    where: {
      userId: session.user.id
    }
  });
  const makeDefault = existingCount === 0 || !!body?.isDefault;

  const address = await db.$transaction(async tx => {
    if (makeDefault) {
      await tx.address.updateMany({
        where: {
          userId: session.user.id
        },
        data: {
          isDefault: false
        }
      });
    }
    return tx.address.create({
      data: {
        userId: session.user.id,
        label,
        name,
        street,
        city,
        country,
        zip: zip || null,
        phone: phone || null,
        isDefault: makeDefault
      }
    });
  });

  return NextResponse.json({
    ok: true,
    address
  });
}
