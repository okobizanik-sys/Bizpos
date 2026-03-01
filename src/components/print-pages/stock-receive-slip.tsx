"use client";

import React from "react";
import { Branches, ChallanItems, Settings } from "@/types/shared";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { fileUrlGenerator, makePrice, makeProductCode } from "@/utils/helpers";
import { getSetting } from "@/services/settings";
import { BRAND_NAME } from "@/config/config";

interface StockReceiveSlipProps {
  existingBranch: Branches;
  challanItemList: ChallanItems[];
}

const StockReceiveSlip = React.forwardRef<
  HTMLDivElement,
  StockReceiveSlipProps
>(({ existingBranch, challanItemList }, ref) => {
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
          <p className="text-xl font-semibold">Received Stocks</p>
        </div>
      </div>

      <div className="mt-4">
        <Table className="rounded-lg overflow-hidden">
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className="h-8 text-white">#</TableHead>
              <TableHead className="h-8 text-white">Barcode</TableHead>
              <TableHead className="h-8 text-white">Product ID</TableHead>
              <TableHead className="h-8 text-white">Product Name</TableHead>
              <TableHead className="h-8 text-white">Category</TableHead>
              <TableHead className="h-8 text-white">Variant</TableHead>
              <TableHead className="h-8 text-white">Qty</TableHead>
              <TableHead className="h-8 text-white">Price</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {challanItemList.map((item, index) => (
              <TableRow key={item.barcode}>
                <TableCell className="py-2">{index + 1}</TableCell>
                <TableCell className="py-2">{item.barcode}</TableCell>
                <TableCell className="py-2">
                  {makeProductCode(Number(item.product_id))}
                </TableCell>
                <TableCell className="py-2">{item.name}</TableCell>
                <TableCell className="py-2">{item.categoryName}</TableCell>
                <TableCell className="py-2">{item.variant}</TableCell>
                <TableCell className="py-2">{item.quantity}</TableCell>
                <TableCell className="py-2">{item.selling_price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

StockReceiveSlip.displayName = "StockReceiveSlip";

export default StockReceiveSlip;
