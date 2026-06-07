import { getOrders } from "@/services/order";
import React from "react";
import { ReturnOrdersTable } from "./table";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { OrderFilter } from "../orders-list/page";
import { FilterReturnOrderForm } from "./filter";
import { Navbar } from "@/components/admin-panel/navbar";
import prisma from "@/db/prisma";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function ReturnOrders({ searchParams }: Props) {
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

  const order = await getOrders(filter);

  const { per_page } = searchParams;
  const limit = typeof per_page === "string" ? parseInt(per_page) : 20;

  const countResult = await prisma.orders.aggregate({
    _count: { id: true },
    where: { status: "RETURN" }
  });
  
  const totals = Number(countResult._count.id);
  const pageCount = Math.ceil(totals / limit);
  
  return (
    <>
      <Navbar title="Return Orders List" />
      <FilterReturnOrderForm currentFilters={filter} />
      <ReturnOrdersTable data={order} pageCount={pageCount} />
    </>
  );
}
