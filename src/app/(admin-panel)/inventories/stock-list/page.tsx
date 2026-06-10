import { ContentLayout } from "@/components/admin-panel/content-layout";
import { StockTable } from "./table";
import { FilterStockForm } from "./filter";
import { Navbar } from "@/components/admin-panel/navbar";
import { StockDashboard } from "./dashboard";
import { getTotalStockSummary } from "@/services/stock";
import prisma from "@/db/prisma";

export const revalidate = 0;

export type ProductWithStockPayload = {
  name: string;
  sku: string;
  selling_price: number;
  barcode: string;
  cost: number;
  supplier_name?: string | null;
  categoryName: string;
  sizeName?: string;
  colorName?: string;
  branchName?: string;
  quantity: number;
  url?: string;
};

export type StockFilter = {
  search: string;
};

export type StockSummary = {
  totalSellValue?: number;
  totalStockValue?: number;
  totalQuantity?: number;
};

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function StockListPage({ searchParams }: Props) {
  const { per_page, page } = searchParams;

  const limit = typeof per_page === "string" ? parseInt(per_page) : 20;
  const currentPage = typeof page === "string" ? parseInt(page) : 1;
  const skip = (currentPage - 1) * limit;

  const filter: StockFilter = {
    search: searchParams.search as string,
  };

  const stockCounts = await getTotalStockSummary();
  const countResult = await prisma.products.aggregate({
    _count: { id: true },
  });

  const totals = Number(countResult._count.id);
  const pageCount = Math.ceil(totals / limit);

  return (
    <>
      <Navbar title="Stock List" />
      <FilterStockForm currentFilters={filter} />
      <StockDashboard summary={stockCounts} />
      <StockTable filter={filter} pageCount={pageCount} />
    </>
  );
}
