import {
  endOfDay,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { StockHistoryTable } from "./table";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { FilterForm } from "./filter";
import { getStockHistoriesCount } from "@/services/stock";
interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function StockHistoryPage({ searchParams }: Props) {
  const { start_date, end_date, per_page } = searchParams;

  const startDate = start_date
    ? startOfDay(new Date(start_date as string))
    : startOfYear(new Date());
  const endDate = end_date
    ? endOfDay(new Date(end_date as string))
    : endOfYear(new Date());

  const whereBlock = {
    where: {
      created_at: {
        gte: startDate,
        lte: endDate,
      },
    },
  };

  const limit = typeof per_page === "string" ? parseInt(per_page) : 20;
  const totalHistories = await getStockHistoriesCount({
    where: { created_at: whereBlock.where.created_at },
  });
  const pageCount = Math.ceil(totalHistories / limit);

  return (
    <ContentLayout title="Stock History">
      <FilterForm />
      <StockHistoryTable
        filter={{ startDate, endDate }}
        pageCount={pageCount}
      />
    </ContentLayout>
  );
}
