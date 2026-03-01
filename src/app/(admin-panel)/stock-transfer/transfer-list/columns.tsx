import { ColumnDef } from "@tanstack/react-table";
import { makeProductCode } from "@/utils/helpers";
import { formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { TransferDetails } from "./details";
import { ChallanGetPayload } from "@/types/shared";

export const columns: ColumnDef<ChallanGetPayload>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Challan No",
    accessorKey: "challan_no",
    // accessorFn: (row) => makeProductCode(Number(row.id)),
    // cell: ({ row }) => makeProductCode(Number(row.original.id)),
  },
  {
    header: "Issue Date",
    accessorKey: "created_at",
    cell: ({ row }) => formatDate(row.original.created_at, "dd/MM/yyyy"),
  },
  {
    header: "Received Date",
    accessorKey: "updated_at",
    cell: ({ row }) =>
      row.original.updated_at &&
      formatDate(row.original.updated_at, "dd/MM/yyyy"),
  },
  {
    header: "From",
    accessorKey: "from_branch_name",
  },
  {
    header: "To",
    accessorKey: "to_branch_name",
  },
  {
    header: "Qty",
    accessorKey: "quantity",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return row.original.status === "RECEIVED" ? (
        <Badge variant="default">Received</Badge>
      ) : (
        <Badge variant="destructive">Pending</Badge>
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return (
        <TransferDetails
          challans={row.original}
        />
      );
    },
  },
];
