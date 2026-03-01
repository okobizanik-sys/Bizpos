import { Navbar } from "@/components/admin-panel/navbar";
import React from "react";
import { CustomersWithOrdersTable } from "./table";
import { getCustomersWithOrders } from "@/services/customer";
import { CustomerFilter } from "../customers-list/page";
import { getGroups } from "@/services/group";
import { FilterCustomerDataForm } from "./filter";

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function CustomersData({ searchParams }: Props) {
  const filter: CustomerFilter = {
    search: searchParams.search as string,
    group: searchParams.group as string,
  };

  const groups = await getGroups();
  const customerWithOrders = await getCustomersWithOrders({
    where: {},
    filters: filter,
  });
  return (
    <>
      <Navbar title="Loyal Customers" />
      <FilterCustomerDataForm currentFilters={filter} groups={groups} />
      <CustomersWithOrdersTable data={customerWithOrders} />
    </>
  );
}
