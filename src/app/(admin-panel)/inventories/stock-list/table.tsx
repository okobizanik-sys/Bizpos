"use client";

import React from "react";
import { ProductWithStockPayload, StockFilter } from "./page";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import exportToCsv from "tanstack-table-export-to-csv";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Printer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PrintPageComponet } from "@/components/print-pages/print-page";
import { columns } from "./columns";
import { getTotalFromTable, makePrice } from "@/utils/helpers";
import { getStocksByProductWithPagination } from "@/services/stock";
import { useBranch } from "@/hooks/store/use-branch";
import { useStore } from "zustand";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Card } from "@/components/ui/card";
import { usePOSStore } from "@/hooks/store/use-pos-store";
import { usePagination } from "@/hooks/use-pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  filter: StockFilter;
}

export const StockTable: React.FC<Props> = ({ filter }) => {
  const printerRef = React.useRef(null);
  const branch = useStore(useBranch, (state) => state.branch);
  const [stocks, setStocks] = React.useState<ProductWithStockPayload[]>([]);
  // console.log(stocks, "stocks from stock table");

  const { page, per_page, pageIndex, pageSize, pagination, setPagination } =
    usePagination();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const {
    calculateTotalSellValue,
    calculateTotalStockQty,
    calculateTotalStockValue,
  } = usePOSStore();

  React.useEffect(() => {
    if (branch) {
      getStocksByProductWithPagination({
        where: { branchId: Number(branch.id) },
        filters: filter,
        page: pageIndex + 1, // API expects 1-based index
        per_page: pageSize,
      }).then((data) => {
        setStocks(data);
      });
    }
  }, [branch, filter, pageIndex, pageSize]);

  // console.log(stocks, "stock produts from stock list");

  const table = useReactTable({
    data: stocks,
    columns,
    // pageCount: pageCount ?? -1,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
  });

  React.useEffect(() => {
    const totalStockQty = getTotalFromTable(table, 5) as number;
    const totalStockValue = getTotalFromTable(table, 6) as number;
    const totalSellValue = getTotalFromTable(table, 7) as number;
    calculateTotalStockQty(totalStockQty);
    calculateTotalStockValue(totalStockValue);
    calculateTotalSellValue(totalSellValue);
  }, [stocks, table]);

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
    <Card className="m-6 p-4 rounded-lg mt-2">
      <div className="flex gap-2 justify-end items-center my-1">
        <span className="flex-1 text-xs">Total Results: {stocks.length}</span>
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
            <TableCell colSpan={5} className="text-right">
              Totals:
            </TableCell>
            <TableCell>{getTotalFromTable(table, 5)}</TableCell>
            <TableCell>{getTotalFromTable(table, 6)}</TableCell>
            <TableCell>{getTotalFromTable(table, 7)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <DataTablePagination table={table} />
      {/* <DataTablePagination
        table={table}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={stocks.length} // Ideally, fetch total stock count separately
        onPageChange={(newPage) =>
          setPagination((prev) => ({ ...prev, pageIndex: newPage }))
        }
        onPageSizeChange={(newSize) =>
          setPagination((prev) => ({ ...prev, pageSize: newSize }))
        }
      /> */}

      <div className="hidden">
        <PrintPageComponet
          ref={printerRef}
          headers={table
            .getHeaderGroups()
            .map((x) => x.headers)
            .flat()}
          rows={table.getRowModel().rows}
          branch={branch}
          pageName="Stock List"
        />
      </div>
    </Card>
  );
};
