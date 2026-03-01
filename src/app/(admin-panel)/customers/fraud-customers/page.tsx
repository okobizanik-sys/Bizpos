import { Navbar } from "@/components/admin-panel/navbar";
import React from "react";
import FraudCustomersList from "./fraud-customers-list";

export default function FraudCustomers() {
  return (
    <>
      <Navbar title="Fraud Customers" />
      <FraudCustomersList />
    </>
  );
}
