import StockReceive from "./stock-receive";
import { Navbar } from "@/components/admin-panel/navbar";

export default async function StockReceivePage() {
  return (
    <>
      <Navbar title="Stock Receive" />
      <StockReceive />
    </>
  );
}
