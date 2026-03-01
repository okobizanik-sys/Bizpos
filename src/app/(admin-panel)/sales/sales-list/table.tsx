"use client";

import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns } from "./columns";
import { Card } from "@/components/ui/card";
import exportToCsv from "tanstack-table-export-to-csv";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { PrintPageComponet } from "@/components/print-pages/print-page";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Printer } from "lucide-react";
import { SalesData } from "@/types/shared";
import { useBranch } from "@/hooks/store/use-branch";
import { useStore } from "zustand";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { usePagination } from "@/hooks/use-pagination";

interface Props {
  data: SalesData[];
}

export const SalesTable: React.FC<Props> = ({ data }) => {
  const printerRef = React.useRef(null);
  const branch = useStore(useBranch, (state) => state.branch);
  // console.log(data, "sales data from sale");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { page, per_page, pageIndex, pageSize, pagination, setPagination } =
    usePagination();

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  React.useEffect(() => {
    setPagination({
      pageIndex: Number(page) - 1,
      pageSize: Number(per_page),
    });
  }, [page, per_page]);

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        per_page: pageSize,
      })}`
    );
  }, [pageIndex, pageSize]);

  const table = useReactTable({
    data,
    columns,
    // pageCount: pageCount ?? -1,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
  });

  const handleExportToCsv = () => {
    const headers = table
      .getHeaderGroups()
      .map((x) => x.headers)
      .flat();

    const rows = table.getRowModel().rows;

    exportToCsv("stock-list-" + format(new Date(), "YMdHHmmss"), headers, rows);
  };

  const handlePrinter = useReactToPrint({
    content: () => printerRef.current,
  });

  return (
    <Card className="m-4 mb-2 p-4 rounded-lg">
      <div className="flex gap-2 justify-end items-center my-1">
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
                        ? "py-1 text-" +
                          (cell.column.columnDef.meta as any)?.align
                        : "py-1"
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
      </Table>

      <DataTablePagination table={table} />

      <div className="hidden">
        <PrintPageComponet
          ref={printerRef}
          headers={table
            .getHeaderGroups()
            .map((x) => x.headers)
            .flat()}
          rows={table.getRowModel().rows}
          branch={branch}
          pageName="Sales"
        />
      </div>
    </Card>
  );
};
