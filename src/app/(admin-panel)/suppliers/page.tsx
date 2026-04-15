import { Navbar } from "@/components/admin-panel/navbar";
import { getSuppliers } from "@/services/supplier";
import { SuppliersManager } from "./suppliers-manager";

export const revalidate = 0;

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <>
      <Navbar title="Suppliers" />
      <SuppliersManager suppliers={suppliers} />
    </>
  );
}
