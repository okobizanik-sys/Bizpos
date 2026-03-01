import { ContentLayout } from "@/components/admin-panel/content-layout";
import { getCustomers } from "@/services/customer";
import React from "react";
import { CustomersTable } from "./table";
import { getGroup, getGroups } from "@/services/group";
import { getMemberships } from "@/services/membership";
import { Navbar } from "@/components/admin-panel/navbar";
import { FilterCustomerForm } from "./filter";

export const revalidate = 0;

export type CustomerFilter = {
  search: string;
  group: string;
  membership?: string;
};

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function CustomerListPage({ searchParams }: Props) {
  const { name_phone, group, membership } = searchParams;
  const filter: CustomerFilter = {
    search: searchParams.search as string,
    group: searchParams.group as string,
    membership: searchParams.membership as string,
  };

  const groups = await getGroups();
  const memberships = await getMemberships();

  const customers = await getCustomers({ where: {}, filters: filter });
  return (
    <>
      <Navbar title="Customers" />
      <FilterCustomerForm
        currentFilters={filter}
        groups={groups}
        memberships={memberships}
      />
      <CustomersTable data={customers} />
    </>
  );
}
