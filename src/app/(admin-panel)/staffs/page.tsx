import { ContentLayout } from "@/components/admin-panel/content-layout";
import { getBranches } from "@/services/branch";
import React from "react";
import { StaffForm } from "./form";
import { getUsers } from "@/services/users";
import { StaffTable } from "./table";
import { Navbar } from "@/components/admin-panel/navbar";

export const revalidate = 0;

export default async function StaffPage() {
  const branches = await getBranches();
  const staffs = await getUsers({ where: {} });
  return (
    <>
      <Navbar title="Staffs" />
      <StaffForm branches={branches} />
      <StaffTable data={staffs} />
    </>
  );
}
