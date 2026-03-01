"use client";

import React from "react";
import { Branches, Customers, Settings } from "@/types/shared";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getSetting } from "@/services/settings";
import { fileUrlGenerator } from "@/utils/helpers";
import { BRAND_NAME } from "@/config/config";
interface FraudCustomerSlipProps {
  existingBranch: Branches;
  fraudCustomers: Customers[];
}

const FraudCustomerSlip = React.forwardRef<
  HTMLDivElement,
  FraudCustomerSlipProps
>(({ existingBranch, fraudCustomers }, ref) => {
  const [settingsData, setSettingsData] = React.useState<Settings>();
  const [logoLoadFailed, setLogoLoadFailed] = React.useState(false);

  React.useEffect(() => {
    getSetting().then((data) => setSettingsData(data));
  }, []);
  const logoSrc = settingsData?.logo_image_url
    ? fileUrlGenerator(settingsData.logo_image_url)
    : "";

  React.useEffect(() => {
    setLogoLoadFailed(false);
  }, [logoSrc]);

  return (
    <div ref={ref} className="w-screen mx-auto p-6">
      <div className="w-full border-b border-gray-700 p-2 flex items-center justify-between">
        <div className="w-1/5">
          {logoSrc && !logoLoadFailed ? (
            <img
              src={logoSrc}
              alt="Bizpos Logo"
              className="w-full h-full object-contain"
              onError={() => setLogoLoadFailed(true)}
            />
          ) : (
            <p className="w-full flex justify-start items-center text-3xl font-bold">
              {BRAND_NAME}
            </p>
          )}
        </div>
        <div className="w-2/5 text-start pl-4">
          <p>Bizpos</p>
          <p>{existingBranch.name}</p>
          <p>{existingBranch.address}</p>
        </div>
        <div className="w-2/5 text-end">
          <p className="text-xl font-semibold">Fraud Customers</p>
        </div>
      </div>

      <div className="mt-4">
        <Table className="rounded-lg overflow-hidden">
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className="h-8 text-white">SL</TableHead>
              <TableHead className="h-8 text-white">Customer</TableHead>
              <TableHead className="h-8 text-white">Phone</TableHead>
              <TableHead className="h-8 text-white">Remarks</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {fraudCustomers.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="py-2">{index + 1}</TableCell>
                <TableCell className="py-2">{item.customer}</TableCell>
                <TableCell className="py-2">{item.phone}</TableCell>
                <TableCell className="py-2">{item.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

FraudCustomerSlip.displayName = "FraudCustomerSlip";

export default FraudCustomerSlip;
