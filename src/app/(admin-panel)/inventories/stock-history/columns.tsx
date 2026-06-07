import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { makeProductCode } from "@/utils/helpers";
import { StockHistory } from "@/types/shared";

export const columns: ColumnDef<StockHistory>[] = [
  {
    header: "Date",
    accessorKey: "created_at",
    cell: ({ row }) => formatDate(row.original.created_at, "dd/MM/yyyy"),
  },
  {
    header: "Name",
    accessorKey: "productName",
  },
  {
    header: "SKU",
    accessorKey: "productSku",
  },
  {
    header: "Category",
    accessorKey: "categoryName",
  },
  {
    header: "Variant",
    accessorKey: "variant",
  },
  {
    header: "Stock",
    accessorKey: "quantity",
    meta: {
      align: "right",
    },
  },
];
