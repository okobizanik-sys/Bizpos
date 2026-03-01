"use client";

import React from "react";
import { OrderWithItem, POSItem } from "@/app/(admin-panel)/pos/item-selector";
import { Branches, Orders, SalesData, Settings } from "@/types/shared";
import { TotalsOfOrder } from "@/app/(admin-panel)/orders/orders-list/dropdown";
import { fileUrlGenerator } from "@/utils/helpers";
import { BRAND_NAME } from "@/config/config";

interface PrintDeliverySlipProps {
  orderData: OrderWithItem[];
  order: Orders | SalesData;
  existingBranch: Branches;
  totals?: TotalsOfOrder[] | undefined;
  settingsData: Settings;
}

const PrintDeliverySlip = React.forwardRef<
  HTMLDivElement,
  PrintDeliverySlipProps
>(({ orderData, order, existingBranch, totals, settingsData }, ref) => {
  const [logoLoadFailed, setLogoLoadFailed] = React.useState(false);
  const logoSrc = settingsData?.logo_image_url
    ? fileUrlGenerator(settingsData.logo_image_url)
    : "";

  React.useEffect(() => {
    setLogoLoadFailed(false);
  }, [logoSrc]);

  // const [settingsData, setSettingsData] = useState<Settings>();
  // console.log(settingsData, "from delivery slip@@@@@@@@@@@@@@");

  // useEffect(() => {
  //   getSetting()
  //     .then((data) => setSettingsData(data))
  //     .catch((error) => console.log(error));
  // }, []);

  return (
    <div ref={ref} className="w-[4in] h-[6in] mx-auto text-xs flex flex-col">
      <div className="border border-black m-1 flex flex-col flex-grow">
        <div className="flex justify-between items-center border-b border-gray-700 divide-x divide-gray-700">
          <div className="w-1/4 p-2">
            {logoSrc && !logoLoadFailed ? (
              <img
                src={logoSrc}
                alt="Bizpos Logo"
                className="h-full object-contain"
                onError={() => setLogoLoadFailed(true)}
              />
            ) : (
              <p className="w-full flex justify-center items-center text-2xl font-bold">
                {BRAND_NAME}
              </p>
            )}
          </div>
          <div className="text-sm p-1 w-3/4">
            {/* <p>{existingBranch.name}</p> */}
            <p>
              {existingBranch.address}
              {"         "}
              Ph: {existingBranch.phone}
            </p>
            {/* <p className="">
              <span className="font-semibold">Hotline:</span>{" "}
              {existingBranch.phone}
            </p> */}
          </div>
        </div>

        <div className="p-1 border-b border-gray-700">
          <div className="flex items-center justify-between pb-2">
            <p className="font-bold">{order.customer}</p>
            <p className="font-bold">{order.phone}</p>
          </div>
          <p>{order.address}</p>
        </div>

        <div className="p-1 flex-grow overflow-auto">
          {orderData?.map((orderItem, index) => (
            <div key={index}>
              {orderItem.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p>{`${item.barcode} - ${item.productName} - ${item.colorName} - ${item.sizeName}`}</p>
                  {/* <h1 className="font-semibold">{item.sellingPrice}</h1> */}
                </div>
              ))}
            </div>
          ))}
        </div>

        {totals?.map((total, index) => (
          <div
            key={index}
            className="flex justify-between border-y divide-x divide-gray-700 border-gray-700"
          >
            <div className="pl-1 py-2 w-1/3">
              <p>Order ID:</p>
              <h1 className="font-semibold">{order.order_id}</h1>
            </div>
            <div className="pl-1 py-2 w-1/3">
              <p>Item Quantity:</p>
              <h1 className="font-semibold">{total.quantity}</h1>
            </div>
            <div className="pl-1 py-2 w-1/3">
              <p>COD:</p>
              <h1 className="font-semibold">BDT {order.due_amount}</h1>
            </div>
          </div>
        ))}

        <div className="p-1">
          <p>
            <span className="font-semibold">Return & Exchange:</span>{" "}
            {/* {settingsData?.return_privacy_policy || ""} */}
            <span
              dangerouslySetInnerHTML={{
                __html: String(settingsData?.return_privacy_policy),
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
});

PrintDeliverySlip.displayName = "PrintDeliverySlip";

export default PrintDeliverySlip;
