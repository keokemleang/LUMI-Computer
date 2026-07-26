import { NextResponse } from "next/server";
import { getSettings, publicSettings } from "@/lib/settings";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({
    ok: true,
    settings: publicSettings(settings)
  });
}
