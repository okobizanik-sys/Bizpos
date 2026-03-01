"use client";

import { PrintPageComponet } from "@/components/print-pages/print-page";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { FileSpreadsheet, Printer } from "lucide-react";
import React from "react";
import { useReactToPrint } from "react-to-print";
import exportToCsv from "tanstack-table-export-to-csv";
import { columns } from "./columns";
import { Categories, StockHistory } from "@/types/shared";
import { ProductList } from "../products/columns";
import { useBranch } from "@/hooks/store/use-branch";
import { useStore } from "zustand";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface Props {
  histories: StockHistory[];
}

export const StockHistoryTable: React.FC<Props> = ({ histories }) => {
  const printerRef = React.useRef(null);
  const branch = useStore(useBranch, (state) => state.branch);

  const table = useReactTable({
    data: histories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleExportToCsv = () => {
    const headers = table
      .getHeaderGroups()
      .map((x) => x.headers)
      .flat();

    const rows = table.getCoreRowModel().rows;

    exportToCsv(
      "stock-history-" + format(new Date(), "YMdHHmmss"),
      headers,
      rows
    );
  };

  const handlePrinter = useReactToPrint({
    content: () => printerRef.current,
  });

  return (
    <>
      <div className="flex gap-2 justify-end items-center my-1">
        <span className="flex-1 text-xs">
          Total Results: {histories.length}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="border-2 border-green-400 text-green-400 w-8 h-8"
          onClick={handleExportToCsv}
        >
          <FileSpreadsheet />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-2 border-blue-400 text-blue-400 w-8 h-8"
          onClick={handlePrinter}
        >
          <Printer />
        </Button>
      </div>
      <Table className="rounded-lg overflow-hidden">
        <TableHeader className="bg-primary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={
                      (header.column.columnDef.meta as any)?.align
                        ? "h-8 text-white text-" +
                          (header.column.columnDef.meta as any)?.align
                        : "h-8 text-white"
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={
                      (cell.column.columnDef.meta as any)?.align
                        ? "py-2 text-" +
                          (cell.column.columnDef.meta as any)?.align
                        : "py-2"
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7} className="text-right">
              Total: {histories.reduce((acc, curr) => acc + curr.quantity, 0)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <DataTablePagination table={table} />

      <div className="hidden">
        <PrintPageComponet
          ref={printerRef}
          headers={table
            .getHeaderGroups()
            .map((x) => x.headers)
            .flat()}
          rows={table.getCoreRowModel().rows}
          branch={branch}
          pageName="Stock History"
        />
      </div>
    </>
  );
};
