"use client";

import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { Input } from "../ui/input";
import Link from "next/link";
import { Brands } from "@/types/shared";

interface Props {
  data: Brands[];
}

const columns: ColumnDef<Brands>[] = [
  {
    header: "#",
    accessorFn: (row, index) => index + 1,
  },
  {
    header: "Name",
    accessorKey: "name",
    id: "name",
    filterFn: "includesString",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <Link
        href={`/inventories/variants?type=brand&id=${row.original.id}&name=${row.original.name}`}
      >
        <Button className="w-4 h-4" variant="ghost" size="icon">
          <Edit size={14} />
        </Button>
      </Link>
    ),
  },
];

export const BrandsTable: React.FC<Props> = ({ data }) => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    columns,
    data,
    state: {
      pagination,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className="flex flex-col gap-2">
      <Input
        placeholder="Search"
        onChange={(e) =>
          table.getColumn("name")?.setFilterValue(e.target.value)
        }
      />

      <Table className="rounded-lg overflow-hidden">
        <TableHeader className="bg-primary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-white h-8">
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
                  <TableCell key={cell.id} className="py-2">
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

      <div className="flex items-center justify-end mt-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            className="w-6 h-6"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="w-6 h-6"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};
