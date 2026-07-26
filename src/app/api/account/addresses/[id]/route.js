import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { parseJsonBody } from "@/lib/parse-json";

async function loadOwned(id, userId) {
  const address = await db.address.findUnique({
    where: {
      id
    }
  });
  if (!address || address.userId !== userId) return null;
  return address;
}

export async function PATCH(req, {
  params
}) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({
      ok: false,
      error: "Unauthorized"
    }, {
      status: 401
    });
  }

  const { id } = await params;
  const existing = await loadOwned(id, session.user.id);
  if (!existing) {
    return NextResponse.json({
      ok: false,
      error: "Address not found"
    }, {
      status: 404
    });
  }

  const { body, errorResponse } = await parseJsonBody(req);
  if (errorResponse) return errorResponse;
  const data = {};
  if (body.name !== undefined) data.name = String(body.name).trim();
  if (body.street !== undefined) data.street = String(body.street).trim();
  if (body.city !== undefined) data.city = String(body.city).trim();
  if (body.country !== undefined) data.country = String(body.country).trim();
  if (body.zip !== undefined) data.zip = body.zip ? String(body.zip).trim() : null;
  if (body.phone !== undefined) data.phone = body.phone ? String(body.phone).trim() : null;
  if (body.label !== undefined && ["Home", "Work", "Other"].includes(body.label)) data.label = body.label;

  if (body.isDefault === true) {
    await db.$transaction([
      db.address.updateMany({
        where: {
          userId: session.user.id
        },
        data: {
          isDefault: false
        }
      }),
      db.address.update({
        where: {
          id
        },
        data: {
          ...data,
          isDefault: true
        }
      })
    ]);
  } else if (Object.keys(data).length > 0) {
    await db.address.update({
      where: {
        id
      },
      data
    });
  }

  const updated = await db.address.findUnique({
    where: {
      id
    }
  });
  return NextResponse.json({
    ok: true,
    address: updated
  });
}

export async function DELETE(req, {
  params
}) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({
      ok: false,
      error: "Unauthorized"
    }, {
      status: 401
    });
  }

  const { id } = await params;
  const existing = await loadOwned(id, session.user.id);
  if (!existing) {
    return NextResponse.json({
      ok: false,
      error: "Address not found"
    }, {
      status: 404
    });
  }

  await db.address.delete({
    where: {
      id
    }
  });

  // Promote the most recent remaining address to default, if any.
  if (existing.isDefault) {
    const next = await db.address.findFirst({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    if (next) {
      await db.address.update({
        where: {
          id: next.id
        },
        data: {
          isDefault: true
        }
      });
    }
  }

  return NextResponse.json({
    ok: true
  });
}
