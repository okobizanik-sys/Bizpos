"use client";

import React from "react";
import { useBranch } from "@/hooks/store/use-branch";
import { useStore } from "@/hooks/store/use-store";
import { StockPayload } from "../stock-transfer/transfer-products/transfer-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StockSelector } from "../stock-transfer/transfer-products/stock-selector";
import {
  ArrowLeftRight,
  LucideArrowRightLeft,
  QrCode,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { BillDetailsForm } from "./form";
import { usePOSStore } from "@/hooks/store/use-pos-store";
import { useToast } from "@/components/ui/use-toast";
import { OrderSelector } from "@/components/admin-panel/order-selector";
import { OrderItems } from "@/types/shared";
import { ExchangeDetailsForm } from "./exchange-form";
import { useBarcodeScanner, playBeep } from "./barcode-scanner.hook";

export type POSItem = {
  id?: bigint;
  barcode: string;
  productId: bigint;
  name: string;
  colorName: string;
  sizeName: string;
  categoryName?: string;
  sku?: string;
  condition?: string;
  quantity: number;
  cost?: number;
  selling_price: number;
  colorId?: number;
  sizeId?: number;
};

export type OrderWithItem = {
  items: OrderItems[];
  ordersId: number;
  customerId: number;
  orderId: string;
  customer: string;
  phone: string;
  address: string;
  discount?: number;
  vat?: number;
  delivery_charge?: number;
  due_amount?: number;
  paid_amount?: number;
  payment_method?: number;
  sub_total?: number;
  total?: number;
};

async function fetchPosStocks(branchId: number) {
  const res = await fetch(`/api/pos/stocks?branch_id=${branchId}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch POS stocks");
  }
  const data = await res.json();
  return data.stocks as StockPayload[];
}

async function fetchPosOrders(branchId: number) {
  const res = await fetch(`/api/pos/orders?branch_id=${branchId}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch POS orders");
  }
  const data = await res.json();
  return data.orders as OrderWithItem[];
}

async function fetchStockCount(branchId: number, barcode: string) {
  const res = await fetch(
    `/api/pos/stock-count?branch_id=${branchId}&barcode=${encodeURIComponent(
      barcode,
    )}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch stock count");
  }

  const data = await res.json();
  return data.totalQuantity as number;
}

export const POSItemSelector: React.FC = () => {
  const branch = useStore(useBranch, (state) => state.branch);
  const {
    itemList,
    addItem,
    removeItem,
    setOrderId,
    orderId,
    updateItemQty,
    exchangeItemList,
    addExchangeItem,
    moveToReturn,
    returnItemList,
    addItemToExchange,
    addExchangeItemList,
    resetExchangeItemList,
    resetAddExchangeItemList,
    resetReturnItemList,
  } = usePOSStore();

  const [stocks, setStocks] = React.useState<StockPayload[]>([]);
  const [stocksLoading, setStocksLoading] = React.useState<boolean>(false);
  const [stocksError, setStocksError] = React.useState<string | null>(null);
  const [orders, setOrders] = React.useState<OrderWithItem[] | null>(null);
  const [loadingOrders, setLoadingOrders] = React.useState(false);
  const [selectedBarcode, setSelectedBarcode] = React.useState<string | null>(
    null,
  );
  const [exgOrder, setExgOrder] = React.useState<OrderWithItem>();
  const [qtyLimit, setQtyLimit] = React.useState<number>(0);
  const [exgQtyLimit, setExgQtyLimit] = React.useState<number>(0);
  const [exchangeOpen, setExchangeOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!branch?.id) {
      setStocks([]);
      setStocksError(null);
      setStocksLoading(false);
      return;
    }

    setStocksLoading(true);
    setStocksError(null);

    fetchPosStocks(Number(branch.id))
      .then((data) => {
        setStocks(data);
      })
      .catch((error) => {
        console.error("Failed to load POS stocks:", error);
        setStocksError(
          error instanceof Error ? error.message : "Failed to load POS stocks.",
        );
        setStocks([]);
      })
      .finally(() => {
        setStocksLoading(false);
      });

    setOrders(null);
    setExgOrder(undefined);
    resetExchangeItemList();
    resetAddExchangeItemList();
    resetReturnItemList();
  }, [
    branch?.id,
    resetAddExchangeItemList,
    resetExchangeItemList,
    resetReturnItemList,
  ]);

  React.useEffect(() => {
    if (!branch?.id || !exchangeOpen || orders !== null || loadingOrders)
      return;

    setLoadingOrders(true);
    fetchPosOrders(Number(branch.id))
      .then((data) => {
        setOrders(data || []);
      })
      .catch((error) => {
        console.error("Failed to load POS orders:", error);
      })
      .finally(() => {
        setLoadingOrders(false);
      });
  }, [branch?.id, exchangeOpen, orders, loadingOrders]);


  const { toast } = useToast();

  const barcodeSelected = async (code: string | null | void) => {
    if (code) {
      if (!branch?.id) {
        toast({
          title: "Branch not selected",
          description: "Please select a branch before adding items.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      setSelectedBarcode(code);
      fetchStockCount(Number(branch.id), code)
        .then((data) => {
          const itemInList = itemList.find((item) => item.barcode === code);
          setQtyLimit(itemInList ? data - itemInList.quantity : data);
        })
        .catch((error) => {
          console.error("Failed to fetch stock count:", error);
        });

      const stock = stocks.find((stock) => stock.barcode === code);
      if (stock) {
        addItem({
          barcode: stock.barcode,
          productId: stock.productId,
          name: stock.name,
          colorId: stock.color_id,
          colorName: stock.colorName || "-",
          sizeId: stock.size_id,
          sizeName: stock.sizeName || "-",
          quantity: 1,
          selling_price: stock.selling_price,
          cost: stock.cost,
        });
        playBeep(true);
        await setOrderId();
      } else {
        playBeep(false);
        toast({
          title: "Barcode not found",
          description: `"${code}" is not available in this branch's stock.`,
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };
  const barcodeExchangeSelected = (code: string | null | void) => {
    if (code) {
      if (!branch?.id) {
        toast({
          title: "Branch not selected",
          description: "Please select a branch before exchanging items.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      setSelectedBarcode(code);
      fetchStockCount(Number(branch.id), code)
        .then((data) => {
          const itemInList = exchangeItemList.find(
            (item) => item.barcode === code,
          );
          setExgQtyLimit(itemInList ? data - itemInList.quantity : data);
        })
        .catch((error) => {
          console.error("Failed to fetch exchange stock count:", error);
        });

      const stock = stocks.find((stock) => stock.barcode === code);
      if (stock) {
        addItemToExchange({
          productId: Number(stock.productId),
          productName: stock.name,
          sellingPrice: stock.selling_price,
          quantity: 1,
          colorName: stock.colorName,
          sizeName: stock.sizeName,
          barcode: stock.barcode,
          colorId: stock.color_id,
          sizeId: stock.size_id,
        });
        playBeep(true);
      } else {
        playBeep(false);
        toast({
          title: "Barcode not found",
          description: `"${code}" is not available in this branch's stock.`,
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };


  const setSelectedOrder = (id: string | null | void) => {
    const foundOrder = orders?.find((order) => order.orderId === id);
    setExgOrder(foundOrder);
    if (foundOrder) {
      resetExchangeItemList();
      resetAddExchangeItemList();
      resetReturnItemList();
      foundOrder.items.map((item) => addExchangeItem(item));
    }
  };

  useBarcodeScanner({
    onScan: exchangeOpen ? barcodeExchangeSelected : barcodeSelected,
  });

  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-span-9">
          <div className="flex flex-col">
            <Card className="flex justify-between items-end p-4 m-2 rounded-lg">
              {exchangeOpen ? (
                <div>
                  <OrderSelector
                    orders={orders}
                    setSelectedOrder={setSelectedOrder}
                  />
                </div>
              ) : (
                <div className="w-1/2 relative">
                  <StockSelector
                    stocks={stocks}
                    setSelectedStock={barcodeSelected}
                    qtyLimit={qtyLimit}
                    clearAfterSelect
                    emptyMessage={
                      stocksLoading
                        ? "Loading products..."
                        : stocksError
                        ? stocksError
                        : "No products available for this branch."
                    }
                  />
                  <QrCode className="opacity-60 absolute right-8 -translate-y-8" />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setExchangeOpen((prev) => !prev);
                  }}
                  className={`${exchangeOpen && "bg-black hover:bg-slate-800"}`}
                >
                  {exchangeOpen ? (
                    <span>POS (F3)</span>
                  ) : (
                    <span className="flex gap-1 items-center">
                      <LucideArrowRightLeft /> Exchange (F7)
                    </span>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {exchangeOpen ? (
            <div>
              <Card className=" p-4 m-2 mt-0 rounded-lg min-h-[calc(100vh-500px)] overflow-scroll no-scrollbar">
                <Table className="rounded-lg overflow-hidden">
                  <TableHeader className="bg-primary">
                    <TableRow>
                      <TableHead className="h-8 text-white">Barcode</TableHead>
                      <TableHead className="h-8 text-white">
                        Product Name
                      </TableHead>
                      <TableHead className="h-8 text-white">Color</TableHead>
                      <TableHead className="h-8 text-white">
                        Level / Size
                      </TableHead>
                      <TableHead className="h-8 text-white">Price</TableHead>
                      <TableHead className="h-8 text-white">Qty</TableHead>
                      <TableHead className="h-8 text-white">Total</TableHead>
                      <TableHead className="h-8 text-white"></TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {exchangeItemList.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.barcode}</TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.colorName}</TableCell>
                        <TableCell>{item.sizeName}</TableCell>
                        <TableCell>{item.sellingPrice}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {Number(item.sellingPrice) * Number(item.quantity)}
                        </TableCell>
                        <TableCell>
                          {" "}
                          <Button
                            size="icon"
                            className="bg-[#FF2DEA] rounded-full w-6 h-6"
                            onClick={() => {
                              moveToReturn(item.barcode);
                            }}
                          >
                            <ArrowLeftRight size={16} />
                          </Button>{" "}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              <Card className=" p-4 m-2 rounded-lg overflow-scroll no-scrollbar">
                <div className="w-1/2 relative mb-4">
                  <Label>Select Product</Label>
                  <StockSelector
                    stocks={stocks}
                    setSelectedStock={barcodeExchangeSelected}
                    qtyLimit={exgQtyLimit}
                    clearAfterSelect
                    emptyMessage={
                      stocksLoading
                        ? "Loading products..."
                        : stocksError
                        ? stocksError
                        : "No products available for this branch."
                    }
                  />
                  <QrCode className="opacity-60 absolute right-8 -translate-y-8" />
                </div>
                <Table className="rounded-lg overflow-hidden">
                  <TableHeader className="bg-primary">
                    <TableRow>
                      <TableHead className="h-8 text-white">Barcode</TableHead>
                      <TableHead className="h-8 text-white">
                        Product Name
                      </TableHead>
                      <TableHead className="h-8 text-white">Color</TableHead>
                      <TableHead className="h-8 text-white">
                        Level / Size
                      </TableHead>
                      <TableHead className="h-8 text-white">Price</TableHead>
                      <TableHead className="h-8 text-white">Qty</TableHead>
                      <TableHead className="h-8 text-white">Total</TableHead>
                      <TableHead className="h-8 text-white"></TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {addExchangeItemList.map((item, index) => (
                      <TableRow key={item.barcode}>
                        <TableCell className="py-2">{item.barcode}</TableCell>
                        <TableCell className="py-2 w-60">
                          {item.productName}
                        </TableCell>
                        <TableCell className="py-2">{item.colorName}</TableCell>
                        <TableCell className="py-2">{item.sizeName}</TableCell>
                        <TableCell className="py-2">
                          {Number(item.sellingPrice)}
                        </TableCell>
                        <TableCell className="py-2 w-20 flex gap-2 items-center">
                          <Input
                            type="number"
                            max={exgQtyLimit}
                            min={1}
                            value={item.quantity}
                            required
                            onChange={(e) =>
                              updateItemQty(
                                item.barcode,
                                parseInt(e.target.value, 10) || 1,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="py-2">
                          {Number(item.quantity) * Number(item.sellingPrice)}
                        </TableCell>
                        <TableCell className="w-8">
                          <Button
                            size="icon"
                            className="w-6 h-6 rounded-full bg-red-200 hover:bg-red-600 text-red-600 hover:text-white"
                            onClick={() => removeItem(item.barcode)}
                          >
                            <Trash2 className="" size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              <Card className=" p-4 m-2 rounded-lg overflow-scroll no-scrollbar">
                <h2>Return Items</h2>
                <Table className="rounded-lg overflow-hidden">
                  <TableHeader className="bg-primary">
                    <TableRow>
                      <TableHead className="h-8 text-white">Barcode</TableHead>
                      <TableHead className="h-8 text-white">
                        Product Name
                      </TableHead>
                      <TableHead className="h-8 text-white">Color</TableHead>
                      <TableHead className="h-8 text-white">
                        Level / Size
                      </TableHead>
                      <TableHead className="h-8 text-white">Price</TableHead>
                      <TableHead className="h-8 text-white">Qty</TableHead>
                      <TableHead className="h-8 text-white">Total</TableHead>
                      <TableHead className="h-8 text-white"></TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {returnItemList.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="py-2">{item.barcode}</TableCell>
                        <TableCell className="py-2 w-60">
                          {item.productName}
                        </TableCell>
                        <TableCell className="py-2">{item.colorName}</TableCell>
                        <TableCell className="py-2">{item.sizeName}</TableCell>
                        <TableCell className="py-2">
                          {Number(item.sellingPrice)}
                        </TableCell>
                        <TableCell className="py-2 w-20 flex gap-2 items-center">
                          <Input
                            type="number"
                            max={exgQtyLimit}
                            min={1}
                            value={item.quantity}
                            required
                            onChange={(e) =>
                              updateItemQty(
                                item.barcode,
                                parseInt(e.target.value, 10) || 1,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="py-2">
                          {Number(item.quantity) * Number(item.sellingPrice)}
                        </TableCell>
                        <TableCell className="w-8">
                          <Button
                            size="icon"
                            className="w-6 h-6 rounded-full bg-red-200 hover:bg-red-600 text-red-600 hover:text-white"
                            onClick={() => removeItem(item.barcode)}
                          >
                            <Trash2 className="" size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          ) : (
            <Card className="p-4 m-2 mt-0 rounded-lg">
              <div className=" mt-2 h-[calc(100vh-260px)] overflow-scroll no-scrollbar">
                <Table className="rounded-lg overflow-hidden">
                  <TableHeader className="bg-primary">
                    <TableRow>
                      <TableHead className="h-8 w-1/12 text-white">
                        Barcode
                      </TableHead>
                      <TableHead className="h-8 w-3/12 text-white">
                        Product Name
                      </TableHead>
                      <TableHead className="h-8 w-2/12 text-white">
                        Color
                      </TableHead>
                      <TableHead className="h-8 w-2/12 text-white">
                        Level / Size
                      </TableHead>
                      <TableHead className="h-8 w-1/12 text-white">
                        Price
                      </TableHead>
                      <TableHead className="h-8 w-1/12 text-white">
                        Qty
                      </TableHead>
                      <TableHead className="h-8 w-1/12 text-white">
                        Total
                      </TableHead>
                      <TableHead className="h-8 w-1/12 text-white"></TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {itemList.map((item, index) => (
                      <TableRow key={item.barcode}>
                        <TableCell className="py-2">{item.barcode}</TableCell>
                        <TableCell className="py-2 w-60">{item.name}</TableCell>
                        <TableCell className="py-2">{item.colorName}</TableCell>
                        <TableCell className="py-2">{item.sizeName}</TableCell>
                        <TableCell className="py-2">
                          {Number(item.selling_price)}
                        </TableCell>
                        <TableCell className="py-2 w-20 flex gap-2 items-center">
                          <Input
                            type="number"
                            max={qtyLimit}
                            min={1}
                            value={item.quantity}
                            required
                            onChange={(e) =>
                              updateItemQty(
                                item.barcode,
                                parseInt(e.target.value, 10) || 1,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="py-2">
                          {Number(item.quantity) * Number(item.selling_price)}
                        </TableCell>
                        <TableCell className="w-8">
                          <Button
                            size="icon"
                            className="w-6 h-6 rounded-full bg-red-200 hover:bg-red-600 text-red-600 hover:text-white"
                            onClick={() => removeItem(item.barcode)}
                          >
                            <Trash2 className="" size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </div>

        {exchangeOpen ? (
          <Card className="col-span-3 p-4 m-2 ml-0 rounded-lg">
            <ExchangeDetailsForm order={exgOrder} />
          </Card>
        ) : (
          <Card className="col-span-3 p-6 m-2 ml-0 rounded-lg">
            <div className="w-full flex justify-between mb-4">
              <p className="w-1/2 font-semibold">Bill Details</p>
              {orderId && (
                <p className="text-base opacity-80 font-normal">#{orderId}</p>
              )}
            </div>
          <BillDetailsForm />
          </Card>
        )}
      </div>


    </>
  );
};
