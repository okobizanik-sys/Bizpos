// columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { SalesDropdown } from "./dropdown";
import { SalesData } from "@/types/shared";
import { formatDate } from "date-fns";

export const columns: ColumnDef<SalesData>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => formatDate(row.original.date, "dd/MM/yyyy"),
  },
  {
    header: "Branch",
    accessorKey: "branchName", // Matches SalesData
  },
  {
    header: "Order ID",
    accessorKey: "order_id", // Matches SalesData
  },
  {
    header: "Customer",
    accessorKey: "customer", // Matches SalesData
  },
  {
    header: "Phone",
    accessorKey: "phone", // Matches SalesData
  },
  {
    header: "Total",
    accessorKey: "total", // Matches SalesData
  },
  {
    header: "COGS",
    accessorKey: "cost_of_goods_sold", // Matches SalesData
  },
  // {
  //   header: "VAT",
  //   accessorKey: "vat", // Matches SalesData, optional
  // },
  {
    header: "Action",
    cell: ({ row }) => {
      return <SalesDropdown order={row.original} />;
    },
  },
];
