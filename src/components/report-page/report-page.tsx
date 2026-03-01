"use client";

import React, { useMemo } from "react";
import { Branches, Customers, User } from "@/types/shared";
import { makeBDPrice } from "@/utils/helpers";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface ReportPageProps {
  branches: Branches[];
  customers: Customers[];
  users: User[];
  totalSales: number;
  totalCOGS: number;
  totalOrders: number;
  totalDueAmount: number;
  totalPaidAmount: number;
  totalStockValue: number;
  branchWiseTotals: Record<
    number,
    { totalSales: number; totalCOGS: number; totalOrders: number }
  >;
}

const ReportPage = React.forwardRef<HTMLDivElement, ReportPageProps>(
  (
    {
      branches,
      customers,
      users,
      totalSales,
      totalCOGS,
      totalOrders,
      totalDueAmount,
      totalPaidAmount,
      totalStockValue,
      branchWiseTotals,
    },
    ref
  ) => {
    const totalProfit = totalSales - totalCOGS;

    // Define columns
    const columns = useMemo<ColumnDef<any>[]>(
      () => [
        { accessorKey: "name", header: "Branch" },
        {
          accessorKey: "sales",
          header: "Total Sales",
          cell: ({ row }) => makeBDPrice(row.original.sales),
        },
        {
          accessorKey: "cogs",
          header: "Total COGS",
          cell: ({ row }) => makeBDPrice(row.original.cogs),
        },
        { accessorKey: "orders", header: "Total Orders" },
      ],
      []
    );

    // Prepare data for table
    const tableData = branches.map((branch) => ({
      name: branch.name,
      sales: branchWiseTotals[Number(branch.id)]?.totalSales || 0,
      cogs: branchWiseTotals[Number(branch.id)]?.totalCOGS || 0,
      orders: branchWiseTotals[Number(branch.id)]?.totalOrders || 0,
    }));

    const table = useReactTable({
      columns,
      data: tableData,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <div>
        <div ref={ref} className="p-4">
          <h2 className="text-xl font-bold text-center mb-4">
            Sales & Inventory Report
          </h2>
          {/* <p>{show}</p> */}

          {/* Summary Table */}
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <tbody>
              <tr>
                <td className="p-2 border">Total Sales</td>
                <td className="p-2 border">{makeBDPrice(totalSales)}</td>
              </tr>
              <tr>
                <td className="p-2 border">Total COGS</td>
                <td className="p-2 border">{makeBDPrice(totalCOGS)}</td>
              </tr>
              <tr>
                <td className="p-2 border">Profit</td>
                <td className="p-2 border">{makeBDPrice(totalProfit)}</td>
              </tr>
              <tr>
                <td className="p-2 border">Total Due Amount</td>
                <td className="p-2 border">{makeBDPrice(totalDueAmount)}</td>
              </tr>
              <tr>
                <td className="p-2 border">Total Paid Amount</td>
                <td className="p-2 border">{makeBDPrice(totalPaidAmount)}</td>
              </tr>
              <tr>
                <td className="p-2 border">Total Stock Value</td>
                <td className="p-2 border">{makeBDPrice(totalStockValue)}</td>
              </tr>
              <tr>
                <td className="p-2 border">Total Orders</td>
                <td className="p-2 border">{totalOrders}</td>
              </tr>
              <tr>
                <td className="p-2 border">Total Customers</td>
                <td className="p-2 border">{customers.length}</td>
              </tr>
              <tr>
                <td className="p-2 border">Total Staff</td>
                <td className="p-2 border">{users.length}</td>
              </tr>
            </tbody>
          </table>

          {/* Branch-wise Breakdown Table */}
          <h3 className="text-lg font-bold mb-2">Branch-wise Breakdown</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-200">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-2 border">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2 border">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

ReportPage.displayName = "ReportPage";

export default ReportPage;
