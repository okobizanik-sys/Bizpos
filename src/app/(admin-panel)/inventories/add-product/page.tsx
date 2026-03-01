import { ContentLayout } from "@/components/admin-panel/content-layout";

import { AddProductForm } from "./form";
import { Navbar } from "@/components/admin-panel/navbar";

export default async function AddProductPage() {
  return (
    <>
      <Navbar title="Add Product" />
      <AddProductForm />
    </>
  );
}
