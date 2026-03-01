import { POSItemSelector } from "./item-selector";
import { Navbar } from "@/components/admin-panel/navbar";

export default function PosPage() {
  return (
    <>
      <Navbar title="POS" />
      <POSItemSelector />
    </>
  );
}
