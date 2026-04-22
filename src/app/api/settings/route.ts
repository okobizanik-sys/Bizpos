import { NextResponse } from "next/server";
import { getSetting } from "@/services/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const setting = await getSetting();
    return NextResponse.json(setting ?? {}, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      {},
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
