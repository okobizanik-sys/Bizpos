import { ContentLayout } from "@/components/admin-panel/content-layout";
import { StockTable } from "./table";
import { FilterStockForm } from "./filter";
import { Navbar } from "@/components/admin-panel/navbar";
import { StockDashboard } from "./dashboard";
import { getTotalStockSummary } from "@/services/stock";

export const revalidate = 0;

export type ProductWithStockPayload = {
  name: string;
  sku: string;
  selling_price: number;
  barcode: string;
  cost: number;
  categoryName: string;
  sizeName?: string;
  colorName?: string;
  branchName?: string;
  quantity: number;
  url?: string;
};

export type StockFilter = {
  search: string;
  // category: string;
  // branch: string;
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
  const { per_page } = searchParams;

  const filter: StockFilter = {
    search: searchParams.search as string,
    // category: searchParams.category as string,
    // branch: searchParams.branch as string,
  };

  const stockCounts = await getTotalStockSummary();

  return (
    <>
      <Navbar title="Stock List" />
      <FilterStockForm currentFilters={filter} />
      <StockDashboard summary={stockCounts} />
      <StockTable filter={filter} />
    </>
  );
}
