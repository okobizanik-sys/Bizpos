import { NextResponse } from "next/server";
import { getStocksByProduct } from "@/services/stock";

export const dynamic = "force-dynamic";

function normalizeStock(stock: any) {
  return Object.fromEntries(
    Object.entries(stock).map(([key, value]) => [
      key,
      typeof value === "bigint" ? Number(value) : value,
    ]),
  );
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const branchId = Number(url.searchParams.get("branch_id"));
    const search = url.searchParams.get("search") || undefined;

    if (!branchId || Number.isNaN(branchId)) {
      return NextResponse.json({ error: "branch_id is required" }, { status: 400 });
    }

    const stocks = await getStocksByProduct({
      where: { branchId },
      filters: search ? { search } : undefined,
    });

    return NextResponse.json(
      { stocks: stocks.map(normalizeStock) },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching POS stocks:", error);
    return NextResponse.json({ error: "Failed to load stocks" }, { status: 500 });
  }
}
