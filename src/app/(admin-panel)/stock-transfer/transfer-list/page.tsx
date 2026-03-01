import { FilterTransferListForm } from "./filter";
import { endOfDay, endOfYear, startOfDay, startOfYear } from "date-fns";
import { getChallans } from "@/services/challan";
import { TransferListTable } from "./table";
import { Navbar } from "@/components/admin-panel/navbar";

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function TransferListPage({ searchParams }: Props) {
  const { start_date, end_date, challan, status } = searchParams;

  const startDate = start_date
    ? startOfDay(new Date(start_date as string))
    : startOfYear(new Date());
  const endDate = end_date
    ? endOfDay(new Date(end_date as string))
    : endOfYear(new Date());

  const challanWhereBlock = challan ? { challan_no: challan } : {};
  const statusWhereBlock = status ? { status: status } : {};

  const whereBlock = {
    ...challanWhereBlock,
    ...statusWhereBlock,
    created_at: {
      gte: startDate,
      lte: endDate,
    },
  };

  const challans = await getChallans({ where: whereBlock });
  // console.log("Challans from transferlist:", challans);

  return (
    <>
      <Navbar title="Stock Transfer List" />
      <FilterTransferListForm />
      <TransferListTable data={challans} />
    </>
  );
}
