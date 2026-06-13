import { ColumnDef } from "@tanstack/react-table";
import { makeBDPrice } from "@/utils/helpers";
import { formatDate } from "date-fns";

export type DamagedStockItem = {
  id?: bigint | number;
  barcode: string;
  name?: string;
  categoryName?: string;
  colorName?: string;
  sizeName?: string;
  sku?: string;
  quantity?: number | string;
  cost?: number | string;
  selling_price?: number | string;
  branchName?: string;
  branchId?: number;
  created_at?: string | Date;
};

export const damageListColumns: ColumnDef<DamagedStockItem>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
    meta: { align: "center" },
  },
  {
    header: "Date",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const date = row.original.created_at;
      if (!date) return "-";
      try {
        return formatDate(new Date(date), "dd/MM/yyyy");
      } catch {
        return "-";
      }
    },
  },
  {
    header: "Branch",
    accessorKey: "branchName",
    cell: ({ row }) => row.original.branchName || "-",
  },
  {
    header: "Barcode",
    accessorKey: "barcode",
  },
  {
    header: "Product Name",
    accessorKey: "name",
    cell: ({ row }) => row.original.name || "-",
  },
  {
    header: "Category",
    accessorKey: "categoryName",
    cell: ({ row }) => row.original.categoryName || "-",
  },
  {
    header: "Variant",
    cell: ({ row }) => {
      const color = row.original.colorName || "-";
      const size = row.original.sizeName || "-";
      return `${color} / ${size}`;
    },
  },
  {
    header: "Qty",
    accessorKey: "quantity",
    meta: { align: "right" },
    cell: ({ row }) => Number(row.original.quantity || 0),
  },
  {
    header: "Stock Value",
    meta: { align: "right" },
    cell: ({ row }) =>
      makeBDPrice(
        Number(row.original.quantity || 0) * Number(row.original.cost || 0)
      ),
  },
  {
    header: "Sell Value",
    meta: { align: "right" },
    cell: ({ row }) =>
      makeBDPrice(
        Number(row.original.quantity || 0) *
          Number(row.original.selling_price || 0)
      ),
  },
];
