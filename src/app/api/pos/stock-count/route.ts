import { NextResponse } from "next/server";
import { getStocksCount } from "@/services/stock";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const branchId = Number(url.searchParams.get("branch_id"));
    const barcode = url.searchParams.get("barcode");

    if (!branchId || Number.isNaN(branchId) || !barcode) {
      return NextResponse.json(
        { error: "branch_id and barcode are required" },
        { status: 400 },
      );
    }

    const totalQuantity = await getStocksCount({
      where: { branch_id: branchId, barcode },
    });

    return NextResponse.json({ totalQuantity }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching POS stock count:", error);
    return NextResponse.json({ error: "Failed to load stock count" }, { status: 500 });
  }
}
