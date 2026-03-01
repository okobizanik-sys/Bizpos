import React from "react";
import { PaginationState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";

export const usePagination = () => {
  const searchParams = useSearchParams();

  const DEFAULT_PAGE = 1;
  const DEFAULT_PER_PAGE = 20;

  const page = searchParams?.get("page") ?? String(DEFAULT_PAGE);
  const per_page = searchParams?.get("per_page") ?? String(DEFAULT_PER_PAGE);

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: Number(page) - 1,
      pageSize: Number(per_page),
    });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  return {
    page,
    per_page,
    pageIndex,
    pageSize,
    pagination,
    setPagination,
  };
};
