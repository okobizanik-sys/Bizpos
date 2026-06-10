import React from "react";
import { ReturnOrdersTable } from "./table";
import { OrderFilter } from "../orders-list/page";
import { FilterReturnOrderForm } from "./filter";
import { Navbar } from "@/components/admin-panel/navbar";
import { getOrders, getOrdersCount } from "@/services/order";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function ReturnOrders({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const per_page = searchParams.per_page
    ? parseInt(searchParams.per_page as string)
    : 20;

  const filter: OrderFilter = {
    search: searchParams.search as string,
    status: searchParams.status ? (searchParams.status as string) : "RETURN",
    fromDate: searchParams.fromDate
      ? new Date(searchParams.fromDate as string)
      : undefined,
    toDate: searchParams.toDate
      ? new Date(searchParams.toDate as string)
      : undefined,
  };

  const order = await getOrders({
    ...filter,
    page,
    per_page,
  });

  const totals = await getOrdersCount({
    ...filter,
    status: "RETURN",
  });
  const pageCount = Math.ceil(totals / per_page);
  
  return (
    <>
      <Navbar title="Return Orders List" />
      <FilterReturnOrderForm currentFilters={filter} />
      <ReturnOrdersTable data={order} pageCount={pageCount} />
    </>
  );
}
