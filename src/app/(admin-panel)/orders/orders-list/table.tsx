// "use client";

// import React from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { columns } from "./columns";
// import exportToCsv from "tanstack-table-export-to-csv";
// import { format } from "date-fns";
// import { useReactToPrint } from "react-to-print";
// import { Button } from "@/components/ui/button";
// import { FileSpreadsheet, Printer } from "lucide-react";
// import { PrintPageComponet } from "@/components/print-pages/print-page";
// import { Orders } from "@/types/shared";
// import { useBranch } from "@/hooks/store/use-branch";
// import { useStore } from "zustand";
// import { DataTablePagination } from "@/components/ui/data-table-pagination";
// import { usePagination } from "@/hooks/use-pagination";
// import { Card } from "@/components/ui/card";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// interface Props {
//   data: Orders[];
//   pageCount: number;
// }

// export const OrdersTable: React.FC<Props> = ({ data, pageCount }) => {
//   const printerRef = React.useRef(null);
//   const branch = useStore(useBranch, (state) => state.branch);
//   const [loading, setLoading] = React.useState(false);
//   const router = useRouter();
//   const pathname = usePathname();
//   const { page, per_page, pageIndex, pageSize, pagination, setPagination } =
//     usePagination();
//   const searchParams = useSearchParams();
//   // console.log(data, "orders from order table");

//   const createQueryString = React.useCallback(
//     (params: Record<string, string | number | null>) => {
//       const newSearchParams = new URLSearchParams(searchParams?.toString());

//       for (const [key, value] of Object.entries(params)) {
//         if (value === null || value === "") {
//           newSearchParams.delete(key);
//         } else {
//           newSearchParams.set(key, String(value));
//         }
//       }

//       return newSearchParams.toString();
//     },
//     [searchParams]
//   );

//   React.useEffect(() => {
//     setPagination({
//       pageIndex: Number(page) - 1,
//       pageSize: Number(per_page),
//     });
//   }, [page, per_page]);

//   React.useEffect(() => {
//     if (branch) {
//       router.push(
//         `${pathname}?${createQueryString({
//           branch_id: String(branch.id),
//           page: pageIndex + 1,
//           per_page: pageSize,
//         })}`
//       );
//     }
//   }, [branch, pageIndex, pageSize]);

//   React.useEffect(() => {
//     const loadingConditions =
//       Number(page) !== pageIndex + 1 || Number(per_page) !== pageSize;

//     setLoading(loadingConditions);
//   }, [page, pageIndex, per_page, pageSize]);

//   const table = useReactTable({
//     data,
//     columns,
//     pageCount: pageCount ?? -1,
//     state: { pagination },
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   const handleExportToCsv = () => {
//     const headers = table
//       .getHeaderGroups()
//       .map((x) => x.headers)
//       .flat();

//     const rows = table.getRowModel().rows;

//     exportToCsv("stock-list-" + format(new Date(), "YMdHHmmss"), headers, rows);
//   };

//   const handlePrinter = useReactToPrint({
//     content: () => printerRef.current,
//   });

//   return (
//     <Card className="m-6 mt-1 p-4 rounded-lg">
//       <div className="flex gap-2 justify-end items-center my-2">
//         <Button
//           variant="outline"
//           size="icon"
//           className="border-2 border-green-400 text-green-400 w-8 h-8"
//           onClick={handleExportToCsv}
//         >
//           <FileSpreadsheet />
//         </Button>
//         <Button
//           variant="outline"
//           size="icon"
//           className="border-2 border-blue-400 text-blue-400 w-8 h-8"
//           onClick={handlePrinter}
//         >
//           <Printer />
//         </Button>
//       </div>

//       <Table className="rounded-lg overflow-hidden">
//         <TableHeader className="bg-primary">
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow key={headerGroup.id}>
//               {headerGroup.headers.map((header) => {
//                 return (
//                   <TableHead
//                     key={header.id}
//                     className={
//                       (header.column.columnDef.meta as any)?.align
//                         ? "h-8 text-white text-" +
//                           (header.column.columnDef.meta as any)?.align
//                         : "h-8 text-white"
//                     }
//                   >
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 );
//               })}
//             </TableRow>
//           ))}
//         </TableHeader>
//         <TableBody>
//           {table.getRowModel().rows?.length ? (
//             table.getRowModel().rows.map((row) => (
//               <TableRow
//                 key={row.id}
//                 data-state={row.getIsSelected() && "selected"}
//               >
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell
//                     key={cell.id}
//                     className={
//                       (cell.column.columnDef.meta as any)?.align
//                         ? "py-1 text-" +
//                           (cell.column.columnDef.meta as any)?.align
//                         : "py-1"
//                     }
//                   >
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="h-24 text-center">
//                 No results.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>

//       <DataTablePagination table={table} />

//       <div className="hidden">
//         <PrintPageComponet
//           ref={printerRef}
//           headers={table
//             .getHeaderGroups()
//             .map((x) => x.headers)
//             .flat()}
//           rows={table.getRowModel().rows}
//           branch={branch}
//           pageName="Orders"
//         />
//       </div>
//     </Card>
//   );
// };

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
import exportToCsv from "tanstack-table-export-to-csv";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Printer } from "lucide-react";
import { PrintPageComponet } from "@/components/print-pages/print-page";
import { Orders } from "@/types/shared";
import { useBranch } from "@/hooks/store/use-branch";
import { useStore } from "zustand";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { usePagination } from "@/hooks/use-pagination";
import { Card } from "@/components/ui/card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  data: Orders[];
  pageCount: number;
}

export const OrdersTable: React.FC<Props> = ({ data, pageCount }) => {
  const printerRef = React.useRef(null);
  const branch = useStore(useBranch, (state) => state.branch);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { page, per_page, pageIndex, pageSize, pagination, setPagination } =
    usePagination();
  const searchParams = useSearchParams();

  // Function to create or update query strings
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

  /**
   * Ensures that the correct query string is applied when the page first loads.
   * If any required parameter (`branch_id`, `page`, `per_page`) is missing, it updates the URL.
   */
  React.useEffect(() => {
    if (
      !searchParams.get("branch_id") ||
      !searchParams.get("page") ||
      !searchParams.get("per_page")
    ) {
      router.replace(
        `${pathname}?${createQueryString({
          branch_id: branch?.id || 1, // Default branch if none is selected
          page: pageIndex + 1,
          per_page: pageSize,
        })}`
      );
    }
  }, [
    branch,
    pathname,
    router,
    pageIndex,
    pageSize,
    searchParams,
    createQueryString,
  ]);

  // Sync pagination state when `page` or `per_page` changes
  React.useEffect(() => {
    setPagination({
      pageIndex: Number(page) - 1,
      pageSize: Number(per_page),
    });
  }, [page, per_page]);

  // Detect when pagination state changes and update the URL accordingly
  React.useEffect(() => {
    if (branch) {
      router.push(
        `${pathname}?${createQueryString({
          branch_id: String(branch.id),
          page: pageIndex + 1,
          per_page: pageSize,
        })}`
      );
    }
  }, [branch, pageIndex, pageSize]);

  // Show loading state while the page is updating
  React.useEffect(() => {
    const loadingConditions =
      Number(page) !== pageIndex + 1 || Number(per_page) !== pageSize;

    setLoading(loadingConditions);
  }, [page, pageIndex, per_page, pageSize]);

  // Setup table with pagination
  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
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
    <Card className="m-6 mt-1 p-4 rounded-lg">
      <div className="flex gap-2 justify-end items-center my-2">
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
          pageName="Orders"
        />
      </div>
    </Card>
  );
};
