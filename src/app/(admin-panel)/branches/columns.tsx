import { ColumnDef } from "@tanstack/react-table";
import { BranchDetailsSheet } from "./details";
import { Branches } from "@/types/shared";

export const columns: ColumnDef<Branches>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Address",
    accessorKey: "address",
  },
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "Root Branch",
    accessorFn: (row) => (row.root ? "Yes" : "No"),
    cell: ({ row }) => (row.original.root ? "Yes" : "No"),
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <BranchDetailsSheet branch={row.original} />;
    },
  },
];
