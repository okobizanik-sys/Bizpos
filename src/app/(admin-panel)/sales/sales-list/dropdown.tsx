"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, Eye, Receipt, ReceiptText } from "lucide-react";
import { FaLocationDot, FaPhone, FaUser } from "react-icons/fa6";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { SalesData, Settings } from "@/types/shared";
import { useBranch } from "@/hooks/store/use-branch";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getOrderByIdWithItems } from "@/services/order";
import { OrderWithItem } from "../../pos/item-selector";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { returnOrder } from "../../orders/orders-list/action";
import { useReactToPrint } from "react-to-print";
import PrintInvoice from "@/components/invoice/page";
import { useStore } from "zustand";
import { TotalsOfOrder } from "../../orders/orders-list/dropdown";
import PrintDeliverySlip from "@/components/print-pages/delivery-slip-print";
import { formatDate } from "date-fns";
import { fileUrlGenerator } from "@/utils/helpers";

interface Prop {
  order: SalesData;
}

export const SalesDropdown: React.FC<Prop> = ({ order }) => {
  const printerRef = React.useRef(null);
  const slipPrinterRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [orderData, setOrderData] = React.useState<OrderWithItem[] | null>(
    null
  );
  const [isOrderDataLoading, setIsOrderDataLoading] = React.useState(false);
  const { toast } = useToast();
  const branch = useStore(useBranch, (state) => state.branch);
  const form = useForm();
  const router = useRouter();
  const [settingsData, setSettingsData] = React.useState<Settings>();

  const handlePrinter = useReactToPrint({
    content: () => printerRef.current,
  });

  const handleSlipPrinter = useReactToPrint({
    content: () => slipPrinterRef.current,
  });

  const totals: TotalsOfOrder[] | undefined = orderData?.map((orderItem) => {
    return orderItem.items.reduce(
      (acc: any, item) => {
        acc.stockValue += Number(item.cost || 0);
        acc.sellValue += Number(item.sellingPrice || 0);
        acc.quantity += Number(item.quantity || 0);
        return acc;
      },
      { stockValue: 0, sellValue: 0, quantity: 0 }
    );
  });

  const getSafeImageSrc = (imageUrl?: string) => {
    if (!imageUrl || imageUrl === "null" || imageUrl === "undefined") return "";
    const src = fileUrlGenerator(imageUrl);
    return src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://")
      ? src
      : "";
  };

  const ensureOrderData = React.useCallback(async () => {
    if (orderData) return orderData;
    if (isOrderDataLoading) return null;

    setIsOrderDataLoading(true);
    try {
      const data = await getOrderByIdWithItems({
        where: { "orders.order_id": order.order_id },
      });
      const safeData = data || [];
      setOrderData(safeData);
      return safeData;
    } finally {
      setIsOrderDataLoading(false);
    }
  }, [isOrderDataLoading, order.order_id, orderData]);

  const ensureSettingsData = React.useCallback(async () => {
    if (settingsData) return settingsData;
    const res = await fetch("/api/settings", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch settings");
    const data = await res.json();
    setSettingsData(data);
    return data;
  }, [settingsData]);

  // console.log(totals, "from order dropdown");
  return (
    <div>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={async () => {
              await ensureOrderData();
              setSheetOpen(true);
            }}
            className="cursor-pointer"
          >
            <Eye size={16} /> <span className="ml-2">View Order</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await ensureOrderData();
              await ensureSettingsData();
              setTimeout(() => {
                handleSlipPrinter?.();
              }, 0);
            }}
            className="cursor-pointer"
          >
            <ReceiptText size={16} />{" "}
            <span className="ml-2">Delivery Slip</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await ensureOrderData();
              setTimeout(() => {
                handlePrinter?.();
              }, 0);
            }}
            className="cursor-pointer"
          >
            <Receipt size={16} /> <span className="ml-2">POS Invoice</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Order Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          className="sm:max-w-[750px] bg-slate-100 overflow-y-auto"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className="mb-6">
            <SheetTitle>Order Details</SheetTitle>
            <Card className="w-full p-4 bg-white rounded-lg">
              <Label className="font-semibold">Customer Info</Label>
              <div className="flex justify-between items-start ">
                <div className="w-2/3">
                  <p className="flex justify-start items-center gap-2">
                    <FaUser size={13} className="text-slate-400" />
                    {order.customer}
                  </p>
                  <p className="flex justify-start items-center gap-2">
                    <FaPhone size={13} className="text-slate-400" />
                    {order.phone}
                  </p>
                  <p className="flex justify-start items-start gap-2">
                    <FaLocationDot size={13} className="text-slate-400 mt-1" />
                    {order.address}
                  </p>
                </div>
                <div className="w-1/3">
                  {orderData?.map((item, index) => (
                    <span key={index} className="flex justify-end">
                      Order ID: #{item.orderId}
                    </span>
                  ))}
                  <p className="flex justify-end items-center gap-2">
                    {order.date
                      ? formatDate(new Date(order.date), "dd/MM/yyyy")
                      : "Invalid Date"}
                    <Calendar size={16} className="text-slate-400" />
                  </p>
                </div>
              </div>
            </Card>
          </SheetHeader>
          {orderData?.map((orderItem) =>
            orderItem.items.map((item, index) => (
              // <Card
              //   key={index}
              //   className="bg-white rounded-lg p-4 mb-1 w-full flex justify-between items-center"
              // >
              //   <div className="w-3/5 flex justify-start items-start gap-2">
              //     <div className="w-1/3">
              //       {item?.productImageUrl !== undefined && (
              //         <Image
              //           src={fileUrlGenerator(item.productImageUrl)}
              //           alt={String(item.productName)}
              //           width={80}
              //           height={80}
              //           className="w-full aspect-square object-cover rounded-lg"
              //         />
              //       )}
              //     </div>
              //     <div className="w-2/3">
              //       <p>{item.productName}</p>
              //       <p>
              //         <span className="text-gray-500">Barcode:</span>{" "}
              //         {item.barcode}
              //       </p>
              //       <p>
              //         <span className="text-gray-500">Size:</span>{" "}
              //         {item.sizeName}
              //       </p>
              //       <p>
              //         <span className="text-gray-500">Color:</span>
              //         {item.colorName}
              //       </p>
              //     </div>
              //   </div>
              //   <div className="w-1/5 flex justify-end items-start">
              //     <span className="text-gray-500">Qty:</span> {item.quantity}
              //   </div>
              //   <div className="w-1/5 flex justify-end items-start">
              //     {item.sellingPrice}
              //   </div>
              // </Card>
              <Card
                key={index}
                className="bg-white rounded-lg p-4 mb-1 w-full grid grid-cols-5"
              >
                <div className="col-span-3 flex justify-start items-start gap-2">
                  <div className="w-1/3">
                    {getSafeImageSrc(item?.productImageUrl) && (
                      <Image
                        src={getSafeImageSrc(item?.productImageUrl)}
                        alt={String(item.productName)}
                        width={80}
                        height={80}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div className="w-2/3">
                    <p>{item.productName}</p>
                    <p>
                      <span className="text-gray-500">Barcode:</span>{" "}
                      {item.barcode}
                    </p>
                    <p>
                      <span className="text-gray-500">Level / Size:</span>{" "}
                      {item.sizeName}
                    </p>
                    <p>
                      <span className="text-gray-500">Color:</span>
                      {item.colorName}
                    </p>
                  </div>
                </div>

                <div className="col-span-1 flex flex-col justify-start items-end">
                  <p>{item.sellingPrice}</p>
                  <p>
                    <span className="text-gray-500">Qty:</span> {item.quantity}
                  </p>
                </div>

                <div className="col-span-1 flex justify-end items-start">
                  {item.sellingPrice * item.quantity}
                </div>
              </Card>
            ))
          )}
          {totals?.map((total, index) => (
            <Card key={index} className="bg-white rounded-lg mt-6 p-4 w-full">
              <Label className="font-semibold">Payment Summary</Label>
              <p className="flex justify-between items-center">
                <span className="text-gray-500">Subtotal</span>{" "}
                {order.sub_total === null ? 0 : order.sub_total}
              </p>
              <p className="flex justify-between items-center">
                <span className="text-gray-500">Delivery Charge</span>{" "}
                {order.delivery_charge === null ? 0 : order.delivery_charge}
              </p>
              <p className="flex justify-between items-center">
                <span className="text-gray-500">Discount</span>{" "}
                {order.discount === null ? 0 : order.discount}
              </p>
              {/* <p className="flex justify-between items-center">
                <span className="text-gray-500">VAT</span>{" "}
                {order.vat === null ? 0 : order.vat}
              </p> */}
              <p className="flex justify-between items-center">
                <span className="text-gray-500">Advance Amount</span>{" "}
                {order.paid_amount === null ? 0 : order.paid_amount}
              </p>
              <p className="flex justify-between items-center">
                <span className="text-gray-500">Due Amount</span>{" "}
                {order.due_amount === null ? 0 : order.due_amount}
              </p>
              <p className="flex justify-between items-center">
                <span className="text-gray-500">
                  Total ({total.quantity} items)
                </span>
                {order.total}
              </p>
            </Card>
          ))}
        </SheetContent>
      </Sheet>

      {/* Print Invoice */}
      <div className="hidden">
        {orderData && (
          <PrintInvoice
            ref={printerRef}
            orderData={orderData}
            order={order}
            existingBranch={branch}
            totals={totals}
          />
        )}
      </div>

      {/* Print Delivery Slip */}
      <div className="hidden">
        {orderData && settingsData && (
          <PrintDeliverySlip
            ref={slipPrinterRef}
            orderData={orderData}
            order={order}
            existingBranch={branch}
            totals={totals}
            settingsData={settingsData}
          />
        )}
      </div>
    </div>
  );
};
