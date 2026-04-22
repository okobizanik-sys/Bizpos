"use client";

import { OrderWithItem } from "@/app/(admin-panel)/pos/item-selector";
import React from "react";
import { Branches, Orders, SalesData, Settings } from "@/types/shared";
import { formatDate } from "date-fns";
import { TotalsOfOrder } from "@/app/(admin-panel)/orders/orders-list/dropdown";
import { fetchSetting } from "@/services/settings-client";
import { fileUrlGenerator } from "@/utils/helpers";
import { BRAND_NAME } from "@/config/config";
import Barcode from "react-barcode";
import { useSession } from "next-auth/react";

interface PrintInvoiceProps {
  orderData: OrderWithItem[];
  order: Orders | SalesData;
  existingBranch: Branches;
  totals?: TotalsOfOrder[];
  onReady?: () => void;
}

const PrintInvoice = React.forwardRef<HTMLDivElement, PrintInvoiceProps>(
  ({ orderData, order, existingBranch, totals, onReady }, ref) => {
    const [settingsData, setSettingsData] = React.useState<Settings>();
    const [logoLoadFailed, setLogoLoadFailed] = React.useState(false);
    const [printableLogo, setPrintableLogo] = React.useState<string>("");
    const { data: session } = useSession();

    // Fetch settings once on mount
    React.useEffect(() => {
      fetchSetting().then((data) => {
        if (data) {
          setSettingsData(data);
        }
      });
    }, []);

    // Build absolute URL for logo so it works inside print iframes
    const logoSrc = React.useMemo(() => {
      if (!settingsData?.logo_image_url) return "";
      const generated = fileUrlGenerator(settingsData.logo_image_url);
      if (generated.startsWith("http://") || generated.startsWith("https://")) {
        return generated;
      }
      return `${window.location.origin}${generated}`;
    }, [settingsData?.logo_image_url]);

    // Convert logo to PNG data URL via canvas
    // Fixes .avif and other formats that don't render in print iframes
    React.useEffect(() => {
      if (!logoSrc) {
        setPrintableLogo("");
        setLogoLoadFailed(false);
        onReady?.(); // no logo — still ready to print
        return;
      }

      const img = new window.Image();

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || 300;
          canvas.height = img.naturalHeight || 100;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/png");
          setPrintableLogo(dataUrl);
          setLogoLoadFailed(false);
        } catch (e) {
          // Canvas tainted (CORS) — fall back to original src
          console.warn("Canvas conversion failed, using src directly:", e);
          setPrintableLogo(logoSrc);
          setLogoLoadFailed(false);
        }
        onReady?.(); // logo converted — ready to print
      };

      img.onerror = () => {
        console.warn("Logo failed to load:", logoSrc);
        setPrintableLogo("");
        setLogoLoadFailed(true);
        onReady?.(); // logo failed — still ready to print (will show brand name)
      };

      img.src = logoSrc;
    }, [logoSrc]);

    return (
      <div
        ref={ref}
        className="w-[80mm] mx-auto border px-2 py-[30px] text-xs font-medium"
      >
        {/* ── Header ── */}
        <div className="w-full flex flex-col justify-center items-center text-center py-2">
          {printableLogo && !logoLoadFailed ? (
            <img
              src={printableLogo}
              alt="Logo"
              className="h-[1cm] w-auto object-contain"
              onError={() => setLogoLoadFailed(true)}
            />
          ) : (
            <p className="w-full flex justify-center items-center text-2xl font-bold">
              {BRAND_NAME}
            </p>
          )}
          <p className="mt-2">{existingBranch.name}</p>
          <p className="text-[10px]">{existingBranch.address}</p>
          <div className="flex items-center justify-center text-[10px]">
            <span>Hotline:</span>&nbsp;
            <span>{existingBranch.phone}</span>
          </div>
          <p className="text-[10px]">
            Email : {session?.user?.email || "Bizposbd@gmail.com"}
          </p>
          <p className="text-[10px]">Website : www.petvet-bd.com</p>
        </div>

        {/* ── Order Meta ── */}
        <div className="w-full border-b border-black py-2">
          <div className="flex justify-between items-center">
            <p>Order ID :</p>
            <h1 className="font-bold">{order.order_id}</h1>
          </div>
          <div className="flex justify-between items-center">
            <p>Date:</p>
            <p className="font-bold">
              {formatDate(String(order.date), "dd/MM/yyyy")}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p>Cashier :</p>
            <p>{session?.user?.name || ""}</p>
          </div>
        </div>

        {/* ── Customer ── */}
        <div className="w-full py-2 border-b border-black">
          <div className="flex justify-between items-center">
            <p>Customer:</p>
            <h1 className="font-bold">{order.customer}</h1>
          </div>
          <div className="flex justify-between items-center">
            <p>Phone:</p>
            <h1 className="font-bold">{order.phone}</h1>
          </div>
        </div>

        {/* ── Line Items ── */}
        <div className="w-full">
          {orderData?.map((orderItem, oi) =>
            orderItem.items.map((item, ii) => (
              <div
                key={`${oi}-${ii}`}
                className="flex justify-between items-end py-2 border-b border-black"
              >
                <div className="flex flex-col flex-1 pr-1">
                  <p>{`#${ii + 1}. ${item.productName} - ${item.colorName} - ${item.sizeName}`}</p>
                  <p className="text-[10px] text-gray-600">
                    {`Barcode: ${item.barcode} | Unit: ${item.quantity} x ${item.sellingPrice}`}
                  </p>
                </div>
                <h1 className="font-bold whitespace-nowrap">
                  {item.sellingPrice * item.quantity}
                </h1>
              </div>
            )),
          )}
        </div>

        {/* ── Totals ── */}
        {totals?.map((total, index) => (
          <div key={index}>
            <div className="py-2 border-b border-black border-dashed">
              <div className="flex justify-between items-center">
                <p>Total Quantity:</p>
                <h1>{total.quantity}</h1>
              </div>
              <div className="flex justify-between items-center">
                <p>Subtotal:</p>
                <h1>{order.sub_total ?? 0}</h1>
              </div>
              <div className="flex justify-between items-center">
                <p>Discount:</p>
                <h1>{order.discount ?? 0}</h1>
              </div>
              <div className="flex justify-between items-center">
                <p>Delivery Charge:</p>
                <h1>{order.delivery_charge ?? 0}</h1>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-bold">Grand Total:</p>
                <h1 className="font-bold">{order.total ?? 0}</h1>
              </div>
            </div>
            <div className="py-2 border-b border-black border-dashed">
              <div className="flex justify-between items-center">
                <p>Advance:</p>
                <h1>{order.paid_amount ?? 0}</h1>
              </div>
              <div className="flex justify-between items-center">
                <p>Due Amount:</p>
                <h1>{order.due_amount ?? 0}</h1>
              </div>
            </div>
          </div>
        ))}

        {/* ── Policy ── */}
        <div className="py-2 border-b border-black text-center">
          <p>
            Items may be exchanged subject to Petvet Clinic &amp; Diagnostic
            sales policies within 7 days. No cash refund is applicable.
          </p>
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-col justify-center items-center py-2">
          <p className="text-center">THANK YOU FOR SHOPPING !</p>
          <Barcode value={order.order_id} width={2} height={25} fontSize={10} />
        </div>
      </div>
    );
  },
);

PrintInvoice.displayName = "PrintInvoice";

export default PrintInvoice;
