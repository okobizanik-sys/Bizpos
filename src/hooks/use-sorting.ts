import React from "react";
import { SortingState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";

export const useSorting = () => {
  const searchParams = useSearchParams();

  const DEFAULT_SORTING = "id:desc";
  const sortParams = searchParams?.get("sort") ?? DEFAULT_SORTING;

  const makeSortingState = (sortParam: string): SortingState => {
    return sortParam.split(",").map((sort) => ({
      id: sort.split(":")[0],
      desc: sort.split(":")[1] === "desc",
    }));
  };

  const makeSortParams = (sorting: SortingState): string => {
    return sorting
      .map((sort) => `${sort.id}:${sort.desc ? "desc" : "asc"}`)
      .join(",");
  };

  const [sorting, setSorting] = React.useState<SortingState>(
    makeSortingState(sortParams)
  );

  return {
    sortParams,
    sorting,
    makeSortingState,
    makeSortParams,
    setSorting,
  };
};
