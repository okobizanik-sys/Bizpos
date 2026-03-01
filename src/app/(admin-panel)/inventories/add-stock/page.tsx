import { ContentLayout } from "@/components/admin-panel/content-layout";
import { StockAddContainer } from "./stock-adder";
import { Navbar } from "@/components/admin-panel/navbar";

export default async function AddStockPage() {
  return (
    <>
      <Navbar title="Add Stock" />
      <StockAddContainer />
    </>
  );
}
