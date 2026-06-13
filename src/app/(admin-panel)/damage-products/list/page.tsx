import { Navbar } from "@/components/admin-panel/navbar";
import { getDamagedStocks } from "@/services/stock";
import { FilterDamageListForm } from "./filter";
import { DamageListDashboard } from "./dashboard";
import { DamageListTable } from "./table";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function DamagedProductsListPage({ searchParams }: Props) {
  const search = searchParams.search as string | undefined;
  const fromDate = searchParams.fromDate
    ? new Date(searchParams.fromDate as string)
    : undefined;
  const toDate = searchParams.toDate
    ? new Date(searchParams.toDate as string)
    : undefined;

  // Build the where clause for the query
  const where: Record<string, any> = {};

  const damagedStocksRaw = await getDamagedStocks({
    where,
  });

  // Serialize BigInt fields from Prisma before passing to client components
  const damagedStocks = damagedStocksRaw.map((item: any) => ({
    ...item,
    id: item.id !== undefined ? Number(item.id) : undefined,
    product_id:
      item.product_id !== undefined ? Number(item.product_id) : undefined,
    branchId:
      item.branchId !== undefined ? Number(item.branchId) : undefined,
    created_at: item.created_at ? String(item.created_at) : undefined,
    updated_at: item.updated_at ? String(item.updated_at) : undefined,
  }));

  // Server-side filtering (by barcode, product name, category, branch, dates)
  const filtered = damagedStocks.filter((item: any) => {
    let match = true;

    if (search) {
      const q = search.toLowerCase();
      match =
        match &&
        (item.barcode?.toLowerCase().includes(q) ||
          item.name?.toLowerCase().includes(q) ||
          item.categoryName?.toLowerCase().includes(q) ||
          item.branchName?.toLowerCase().includes(q));
    }

    if (fromDate) {
      const created = item.created_at ? new Date(item.created_at) : null;
      if (created) match = match && created >= fromDate;
    }

    if (toDate) {
      const created = item.created_at ? new Date(item.created_at) : null;
      const endOfDay = new Date(toDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (created) match = match && created <= endOfDay;
    }

    return match;
  });

  const currentFilters = {
    search,
    fromDate,
    toDate,
  };

  return (
    <>
      <Navbar title="Damaged Products List" />
      <FilterDamageListForm currentFilters={currentFilters} />
      <DamageListDashboard data={filtered} />
      <DamageListTable data={filtered} />
    </>
  );
}
