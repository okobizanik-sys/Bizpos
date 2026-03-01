"use client";

import React from "react";
import {
  ColumnDef,
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/use-pagination";
import { useSorting } from "@/hooks/use-sorting";
import { useFiltering } from "@/hooks/use-filtering";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { FileSpreadsheet, Printer } from "lucide-react";
import exportToCsv from "tanstack-table-export-to-csv";
import { format } from "date-fns";
import { PrintPageComponet } from "@/components/print-pages/print-page";
import { useReactToPrint } from "react-to-print";
import { Categories } from "@/types/shared";
import { useBranch } from "@/hooks/store/use-branch";
import { useStore } from "zustand";
import { BarcodePrintDialog } from "@/components/BarcodePrintDialog";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  categories: Categories[];
  totalProduct: number;
}

export function ProductDataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  categories,
  totalProduct,
}: DataTableProps<TData, TValue>) {
  const [loading, setLoading] = React.useState(false);
  const branch = useStore(useBranch, (state) => state.branch);

  const printerRef = React.useRef(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { page, per_page, pageIndex, pageSize, pagination, setPagination } =
    usePagination();

  const { sortParams, sorting, setSorting, makeSortingState, makeSortParams } =
    useSorting();

  const {
    globalFilterParam,
    globalFilter,
    setGlobalFilter,
    makeFilterState,
    makeFilterParams,
    columnFilterParam,
    columnFilters,
    setColumnFilters,
  } = useFiltering();

  const filterForm = useForm({
    defaultValues: {
      globalFilter: globalFilter,
      categoryFilter:
        (columnFilters.find((filter) => filter.id === "category")
          ?.value as string) || "",
    },
  });

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
    [searchParams],
  );

  React.useEffect(() => {
    setPagination({
      pageIndex: Number(page) - 1,
      pageSize: Number(per_page),
    });
  }, [page, per_page]);

  React.useEffect(() => {
    setSorting(makeSortingState(sortParams));
  }, [sortParams]);

  React.useEffect(() => {
    setGlobalFilter(globalFilterParam);
  }, [globalFilterParam]);

  React.useEffect(() => {
    const filterState = makeFilterState(columnFilterParam);
    setColumnFilters(filterState);
  }, [columnFilterParam]);

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        per_page: pageSize,
        sort: makeSortParams(sorting),
        filter_global: globalFilter,
        filter: makeFilterParams(columnFilters),
      })}`,
    );
  }, [pageIndex, pageSize, sorting, globalFilter, columnFilters]);

  React.useEffect(() => {
    const loadingConditions =
      Number(page) !== pageIndex + 1 ||
      Number(per_page) !== pageSize ||
      sortParams !== makeSortParams(sorting) ||
      globalFilterParam !== globalFilter ||
      columnFilterParam !== makeFilterParams(columnFilters);

    setLoading(loadingConditions);
  }, [
    page,
    pageIndex,
    per_page,
    pageSize,
    sortParams,
    sorting,
    sortParams,
    globalFilter,
    globalFilterParam,
    columnFilters,
    columnFilterParam,
  ]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination,
      sorting,
      globalFilter,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    onSortingChange: setSorting,
    manualSorting: true,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    manualFiltering: true,
  });

  const handleFilterSubmit = (values: {
    globalFilter: string;
    categoryFilter: string;
  }) => {
    const { globalFilter, categoryFilter } = values;

    table.setGlobalFilter(globalFilter);
    table.getColumn("category")?.setFilterValue(categoryFilter);
  };

  const handleClearFilters = () => {
    table.setGlobalFilter("");
    table.getColumn("category")?.setFilterValue("");
    filterForm.reset();
  };

  const handleExportToCsv = () => {
    const headers = table
      .getHeaderGroups()
      .map((x) => x.headers)
      .flat();

    const rows = table.getCoreRowModel().rows;

    exportToCsv(
      "product-list-" + format(new Date(), "YMdHHmmss"),
      headers,
      rows,
    );
  };

  const handlePrinter = useReactToPrint({
    content: () => printerRef.current,
  });

  return (
    <div>
      <div className="flex justify-between items-center py-4">
        <form
          className="flex items-center gap-2 w-full"
          onSubmit={filterForm.handleSubmit(handleFilterSubmit)}
        >
          <Form {...filterForm}>
            <FormField
              name="globalFilter"
              control={filterForm.control}
              render={({ field }) => (
                <Input
                  placeholder="Enter ID/Name/SKU to search..."
                  className="max-w-sm"
                  {...field}
                />
              )}
            />

            {/* <FormField
              name="categoryFilter"
              control={filterForm.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            /> */}

            <Button type="submit">Apply Filter</Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </Form>
        </form>
        <div className="flex items-center gap-2">
          <BarcodePrintDialog />
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-green-400 text-green-400"
            onClick={handleExportToCsv}
          >
            <FileSpreadsheet />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-blue-400 text-blue-400"
            onClick={handlePrinter}
          >
            <Printer />
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-2">
        Total No. of products:{" "}
        <span className="font-semibold">{totalProduct}</span>
      </p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(Number(per_page))].map((i) => (
                <TableRow key={i}>
                  {columns.map((cell) => (
                    <TableCell key={cell.id}>
                      <Skeleton className="h-12 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
          pageName="Products"
        />
      </div>
    </div>
  );
}
