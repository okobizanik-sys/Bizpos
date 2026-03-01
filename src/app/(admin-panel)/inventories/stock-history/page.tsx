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
import { getStockHistories } from "@/services/stock";
interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function StockHistoryPage({ searchParams }: Props) {
  const { start_date, end_date } = searchParams;

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

  const histories = await getStockHistories({
    where: { created_at: whereBlock.where.created_at },
  });
  // console.log(histories);

  return (
    <ContentLayout title="Stock History">
      <FilterForm />
      <StockHistoryTable histories={histories} />
    </ContentLayout>
  );
}
