import { ColumnDef } from "@tanstack/react-table";
import { CustomerDetailsSheet } from "./details";
import { Customers } from "@/types/shared";
import { getFirst50Characters } from "@/utils/helpers";

export const columns: ColumnDef<Customers>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Group",
    accessorKey: "groupName",
  },
  {
    header: "Customer",
    accessorKey: "customer",
  },
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "Address",
    accessorKey: "address",
    cell: ({ row }) => {
      return getFirst50Characters(String(row.original.address));
    },
  },
  {
    header: "Membership",
    accessorKey: "membershipType",
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <CustomerDetailsSheet customer={row.original} />;
    },
  },
];
