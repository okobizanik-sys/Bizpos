import React from "react";
import { OrdersTable } from "./table";
import { FilterOrderForm } from "./filter";
import { getOrders, getOrdersCount } from "@/services/order";
import { Navbar } from "@/components/admin-panel/navbar";

export const revalidate = 0;

export type OrderFilter = {
  search?: string;
  status?: string;
  fromDate?: Date;
  toDate?: Date;
  saleChannel?: string;
};

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function OrderPage({ searchParams }: Props) {
  const branchId = searchParams.branch_id
    ? parseInt(searchParams.branch_id as string)
    : null;

  // if (!branchId) {
  //   return <p>No branch selected</p>;
  // }
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const per_page = searchParams.per_page
    ? parseInt(searchParams.per_page as string)
    : 20;

  const filter: OrderFilter = {
    search: searchParams.search as string,
    status: searchParams.status ? (searchParams.status as string) : "ALL",
    saleChannel: searchParams.saleChannel
      ? (searchParams.saleChannel as string)
      : "ALL",
    fromDate: searchParams.fromDate
      ? new Date(searchParams.fromDate as string)
      : undefined,
    toDate: searchParams.toDate
      ? new Date(searchParams.toDate as string)
      : undefined,
  };

  const fetchedOrders = await getOrders({
    ...filter,
    branchId: branchId || undefined,
    page,
    per_page,
  });

  const totals = await getOrdersCount({
    ...filter,
    branchId: branchId || undefined,
  });
  const pageCount = Math.ceil(totals / per_page);

  return (
    <>
      <Navbar title="Order List" />
      <FilterOrderForm currentFilters={filter} />
      <OrdersTable
        data={fetchedOrders}
        pageCount={pageCount}
        // currentPage={page}
      />
    </>
  );
}
