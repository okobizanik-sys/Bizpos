import { Navbar } from "@/components/admin-panel/navbar";
import { getUniqueCustomers } from "@/services/customer";
import { DashboardFilterType, getDashboardSummary } from "@/services/sales";
import { getBranches } from "@/services/branch";
import AdminDashboard from "./dashboard";
import { getUsers } from "@/services/users";
import { getTotalStockSummary } from "@/services/stock";
import { unstable_noStore as noStore } from "next/cache";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const FILTER_TYPES: DashboardFilterType[] = [
  "today",
  "week",
  "month",
  "lifetime",
];

export default async function AdminDashboardPage({ searchParams }: Props) {
  noStore();

  const selectedFilterParam = searchParams.show;
  const selectedFilter =
    typeof selectedFilterParam === "string" &&
    FILTER_TYPES.includes(selectedFilterParam as DashboardFilterType)
      ? (selectedFilterParam as DashboardFilterType)
      : "lifetime";

  const [customers, summary, users, branches, stockCounts] =
    await Promise.all([
      getUniqueCustomers({ where: {} }),
      getDashboardSummary(selectedFilter),
      getUsers({ where: {} }),
      getBranches(),
      getTotalStockSummary(),
    ]);

  // console.log(salesSummary, "sales summary from dashboard");

  return (
    <>
      <Navbar title="Dashboard" />
      <AdminDashboard
        summary={summary}
        branches={branches}
        customers={customers}
        users={users}
        stockSummary={stockCounts}
        selectedFilter={selectedFilter}
      />
    </>
  );
}
