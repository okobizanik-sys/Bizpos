import { TransferLayout } from "./transfer-layout";
import { getBranches } from "@/services/branch";
import { Navbar } from "@/components/admin-panel/navbar";

export default async function StockTransferPage() {
  const branches = await getBranches();
  return (
    <>
      <Navbar title="Transfer Products" />
      <TransferLayout branches={branches} />
    </>
  );
}
