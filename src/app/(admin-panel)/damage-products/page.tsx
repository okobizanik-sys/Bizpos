import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import DamageProducts from "./damage_products";
import { Navbar } from "@/components/admin-panel/navbar";

export default function DamageProductsPage() {
  return (
    <>
      <Navbar title="Damage Products" />
      <DamageProducts />
    </>
  );
}
