import React from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";

export const useFiltering = () => {
  const searchParams = useSearchParams();

  const DEFAULT_FILTER = "";

  const globalFilterParam =
    searchParams?.get("filter_global") ?? DEFAULT_FILTER;

  const columnFilterParam = searchParams?.get("filter") ?? DEFAULT_FILTER;

  const [globalFilter, setGlobalFilter] = React.useState(globalFilterParam);

  const makeFilterState = (filterParam: string): ColumnFiltersState => {
    if (!filterParam) return [];
    return filterParam.split(",").map((filter) => ({
      id: filter.split(":")[0],
      value: filter.split(":")[1],
    }));
  };

  const makeFilterParams = (filtering: ColumnFiltersState): string => {
    return filtering.map((filter) => `${filter.id}:${filter.value}`).join(",");
  };

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    makeFilterState(columnFilterParam)
  );

  return {
    globalFilterParam,
    globalFilter,
    setGlobalFilter,
    columnFilterParam,
    columnFilters,
    setColumnFilters,
    makeFilterState,
    makeFilterParams,
  };
};
