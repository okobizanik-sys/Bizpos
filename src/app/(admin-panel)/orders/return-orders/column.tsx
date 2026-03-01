import { ColumnDef } from "@tanstack/react-table";
import { Orders } from "@/types/shared";
import { formatDate } from "date-fns";
import { OrdersReturnDropdown } from "./dropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { FaLocationDot, FaPhone, FaUser } from "react-icons/fa6";
import React from "react";
import copy from "copy-to-clipboard";

export const columns: ColumnDef<Orders>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => formatDate(String(row.original.date), "dd/MM/yyyy"),
  },
  {
    header: "Order ID",
    accessorKey: "order_id",
  },
  {
    header: "Customer Info",
    accessorKey: "address",
    cell: ({ row }) => {
      const [copying, setCopying] = React.useState<boolean>(false);

      const handleCopy = () => {
        copy(String(row.original.address));
        setCopying(true);
        setTimeout(() => {
          setCopying(false);
        }, 2000);
      };
      return (
        <div className="flex justify-between items-center gap-1">
          <div>
            <p className="flex justify-start items-center gap-1">
              <FaUser size={10} className="text-slate-600" />
              {row.original.customer}
            </p>
            <p className="flex justify-start items-center gap-1">
              <FaPhone size={10} className="text-slate-600" />
              {row.original.phone}
            </p>
            <p className="flex justify-start items-start gap-1">
              <FaLocationDot size={12} className="text-slate-600 mt-1" />
              {row.original.address}
            </p>
          </div>

          <Button variant="outline" className="" onClick={handleCopy}>
            {copying ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
          </Button>
        </div>
      );
    },
  },
  {
    header: "Total",
    accessorKey: "total",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: () => {
      return <Badge className="bg-[#CA3000]">Return</Badge>;
    },
  },
  {
    header: "Reason",
    accessorKey: "comment",
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <OrdersReturnDropdown order={row.original} />;
    },
  },
];
