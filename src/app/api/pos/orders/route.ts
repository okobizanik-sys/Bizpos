import { NextResponse } from "next/server";
import { getOrdersWithItems } from "@/services/order";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const branchId = Number(url.searchParams.get("branch_id"));

    if (!branchId || Number.isNaN(branchId)) {
      return NextResponse.json({ error: "branch_id is required" }, { status: 400 });
    }

    const orders = await getOrdersWithItems({
      where: { "branches.id": branchId },
    });

    return NextResponse.json({ orders }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching POS orders:", error);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
