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
import { Branches } from "@/types/shared";

interface Props {
  data: Branches[];
}

export const BranchesTable: React.FC<Props> = ({ data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
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
    </>
  );
};
