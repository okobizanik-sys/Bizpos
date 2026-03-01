import React from "react";
import { SettingsForm } from "./form";
import { Navbar } from "@/components/admin-panel/navbar";
import { getSetting, getSettings } from "@/services/settings";
import { Card, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { PaymentMethodsForm } from "./payment-method-form";
import { SettingsTable } from "./table";

export const revalidate = 0;

export default async function SettingsPage() {
  const setting = await getSettings();
  // console.log(setting, "settig from settig page....................");
  return (
    <>
      <Navbar title="Settings" />
      <SettingsTable data={setting} />
      <PaymentMethodsForm />
    </>
  );
}
