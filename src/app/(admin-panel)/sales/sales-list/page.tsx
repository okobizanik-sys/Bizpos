import React from "react";
import { SalesTable } from "./table";
import { getSalesData } from "@/services/sales";
import { SalesDashboard } from "./dashboard";
import { Navbar } from "@/components/admin-panel/navbar";
import { FilterSalesForm } from "./filter";
import { OrderFilter } from "../../orders/orders-list/page";

export const revalidate = 0; 

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}


export default async function SalesPage({ searchParams }: Props) {
  const filter: OrderFilter = {
    search: searchParams.search as string,
    fromDate: searchParams.fromDate
      ? new Date(searchParams.fromDate as string)
      : undefined,
    toDate: searchParams.toDate
      ? new Date(searchParams.toDate as string)
      : undefined,
  };

  const sales = await getSalesData(filter);

  return (
    <>
      <Navbar title="Sales List" />
      <FilterSalesForm currentFilters={filter} />
      <SalesDashboard salesData={sales} />
      <SalesTable data={sales} />
    </>
  );
}
