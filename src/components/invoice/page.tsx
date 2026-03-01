"use client";

import { OrderWithItem, POSItem } from "@/app/(admin-panel)/pos/item-selector";
import React from "react";
import { Branches, Orders, SalesData, Settings } from "@/types/shared";
import { formatDate } from "date-fns";
import { TotalsOfOrder } from "@/app/(admin-panel)/orders/orders-list/dropdown";
import { getSetting } from "@/services/settings";
import { fileUrlGenerator } from "@/utils/helpers";
import { BRAND_NAME } from "@/config/config";
import Barcode from "react-barcode";
import { useSession } from "next-auth/react";

interface PrintInvoiceProps {
  orderData: OrderWithItem[];
  order: Orders | SalesData;
  existingBranch: Branches;
  totals?: TotalsOfOrder[] | undefined;
}

const PrintInvoice = React.forwardRef<HTMLDivElement, PrintInvoiceProps>(
  ({ orderData, order, existingBranch, totals }, ref) => {
    const [settingsData, setSettingsData] = React.useState<Settings>();
    const [logoLoadFailed, setLogoLoadFailed] = React.useState(false);
    const { data } = useSession();

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
      <div ref={ref} className="w-[80mm] mx-auto border px-2 py-[30px] text-xs font-medium">
        <div className="w-full flex flex-col justify-center items-center text-center py-2">
          {logoSrc && !logoLoadFailed ? (
            <img
              src={logoSrc}
              alt="Bizpos Logo"
              height={40}
              width={150}
              className="h-[0.8cm] object-contain"
              onError={() => setLogoLoadFailed(true)}
            />
          ) : (
            <p className="w-full flex justify-start items-center text-2xl font-bold">
              {BRAND_NAME}
            </p>
          )}
          <p className="mt-2">{existingBranch.name}</p>
          <p className="text-[10px]">{existingBranch.address}</p>
          <div className="flex items-center justify-start text-[10px]">
            <span>Hotline:</span>{" "}
            <span className="">{existingBranch.phone}</span>
          </div>
          <p className=" text-[10px]">
            Email : {data?.user.email || "Bizposbd@gmail.com"}
          </p>
          <p className=" text-[10px]">Website : www.Bizpos.com</p>
        </div>

        <div className="w-full border-b border-[#000000] py-2">
          <div className="flex justify-between items-center">
            <p className="">Order ID : </p>
            <h1 className="font-bold">{order.order_id}</h1>
          </div>
          <div className="flex justify-between items-center">
            <p className="">Date:</p>{" "}
            <p className="font-bold">
              {formatDate(String(order.date), "dd/MM/yyyy")}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="">Cashier : </p>
            <p className="">{data?.user?.name || ""}</p>
          </div>
        </div>

        <div className="w-full py-2 border-b border-[#000000]">
          <div className="flex justify-between items-center">
            <p className="">Customer:</p>
            <h1 className="font-bold">{order.customer}</h1>
          </div>
          <div className="flex justify-between items-center">
            <p className="">Phone:</p>
            <h1 className="font-bold">{order.phone}</h1>
          </div>
        </div>

        <div className="w-full">
          {orderData?.map((orderItem, index) => (
            <div key={index}>
              {orderItem.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-end py-2 border-b border-[#000000]"
                >
                  <div className="flex">
                    <p>#{index + 1}.</p>
                    <p>{`${item.productName} - ${item.colorName} - ${item.sizeName}  ${item.barcode}, Unit: ${item.quantity} x ${item.sellingPrice}`}</p>
                  </div>
                  <h1 className="font-bold">
                    {item.sellingPrice * item.quantity}
                  </h1>
                </div>
              ))}
            </div>
          ))}
        </div>

        {totals?.map((total, index) => (
          <div key={index} className="">
            <div className="py-2 border-b border-[#000000] border-dashed">
              <div className="flex justify-between items-center">
                <p>Total Quantity:</p>
                <h1 className="">{total.quantity}</h1>
              </div>
              <div className="flex justify-between items-center">
                <p>Subtotal:</p>
                <h1 className="">
                  {order.sub_total === null ? 0 : order.sub_total}
                </h1>
              </div>
              <div className="flex justify-between items-center">
                <p className="">Discount:</p>
                <h1 className="">
                  {order.discount === null ? 0 : order.discount}
                </h1>
              </div>
              <div className="flex justify-between items-center">
                <p className="">Delivery Charge:</p>
                <h1 className="">
                  {order.delivery_charge === null ? 0 : order.delivery_charge}
                </h1>
              </div>
              {/* <div className="flex justify-between items-center">
                <p className="">VAT:</p>
                <h1 className="">{order.vat === null ? 0 : order.vat}</h1>
              </div> */}
              <div className="flex justify-between items-center">
                <p className="font-bold">Grand Total:</p>
                <h1 className="font-bold">
                  {order.total === null ? 0 : order.total}
                </h1>
              </div>
            </div>
            <div className="py-2 border-b border-[#000000] border-dashed">
              <div className="flex justify-between items-center">
                <p className="">Advance:</p>
                <h1 className="">
                  {order.paid_amount === null ? 0 : order.paid_amount}
                </h1>
              </div>
              <div className="flex justify-between items-center">
                <p className="">Due Amount:</p>
                <h1 className="">
                  {order.due_amount === null ? 0 : order.due_amount}
                </h1>
              </div>
            </div>
          </div>
        ))}

        <div className="py-2 border-b border-[#000000] text-center">
          <p>
            Items may be exchanged subject to Bizpos sales policies within
            7days. No cash refund is applicable.
          </p>
        </div>

        <div className="flex flex-col justify-center items-center py-2">
          <p className="text-center">THANK YOU FOR SHOPPING !</p>
          <Barcode value={order.order_id} width={2} height={25} fontSize={10} />
        </div>
      </div>
    );
  }
);

PrintInvoice.displayName = "PrintInvoice";

export default PrintInvoice;
