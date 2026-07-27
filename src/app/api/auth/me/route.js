import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({
        ok: false,
        user: null
      });
    }
    return NextResponse.json({
      ok: true,
      user: session.user
    });
  } catch (err) {
    console.error("[api/auth/me] Unhandled error:", err);
    return NextResponse.json({
      ok: false,
      error: "Something went wrong. Please try again."
    }, {
      status: 500
    });
  }
}
