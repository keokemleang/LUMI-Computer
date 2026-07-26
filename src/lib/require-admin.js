import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return {
      session: null,
      error: NextResponse.json({
        ok: false,
        error: "Unauthorized"
      }, {
        status: 401
      })
    };
  }
  return {
    session,
    error: null
  };
}
