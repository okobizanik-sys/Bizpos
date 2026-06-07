import { ColumnDef } from "@tanstack/react-table";
import { CustomerWithOrders } from "@/types/shared";
import { makePrice } from "@/utils/helpers";

export const columns: ColumnDef<CustomerWithOrders>[] = [
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
    accessorKey: "customerName",
  },
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "Orders",
    accessorKey: "orders",
  },

  {
    header: "Return",
    accessorKey: "return",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
];
