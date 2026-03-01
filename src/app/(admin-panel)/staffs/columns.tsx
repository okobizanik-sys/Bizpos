import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { StaffDetailSheet } from "./details";
import { User } from "@/types/shared";

export const columns: ColumnDef<User>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Staff",
    accessorKey: "name",
  },
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Designation",
    accessorKey: "role",
  },
  {
    header: "Branch",
    accessorKey: "branchName",
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <StaffDetailSheet user={row.original} />;
    },
  },
];
