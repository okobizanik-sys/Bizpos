"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { OrderWithItem } from "./item-selector";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, BadgePercent, TruckIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { billFormSchema } from "./form-schema";
import { useToast } from "@/components/ui/use-toast";
import { usePOSStore } from "@/hooks/store/use-pos-store";
import { useBranch } from "@/hooks/store/use-branch";
import { useReactToPrint } from "react-to-print";
import { makeFormData } from "@/utils/helpers";
import { updateBillDetails } from "./action";
import { z } from "zod";
import { useStore } from "zustand";

interface ExchangeProps {
  order?: OrderWithItem;
}

export type CustomerData = {
  id: number;
  orderId: string;
  customerId: number;
};

export const ExchangeDetailsForm: React.FC<ExchangeProps> = ({ order }) => {
  const [loading, setLoading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [customerData, setCustomerData] = React.useState<CustomerData>();
  const [paymentAmount, setPaymentAmount] = React.useState(0);
  const [dueAmount, setDueAmount] = React.useState(0);
  const [changeAmount, setChangeAmount] = React.useState(0);

  const { toast } = useToast();
  const {
    subExgTotal,
    totalExgQty,
    discount,
    deliveryCharge,
    vatRate,
    exgTotal,
    setCustomerDetails,
    exchangeItemList,
    addExchangeItemList,
    returnItemList,
    setDeliveryCharge,
    calculateExgTotals,
    resetAddExchangeItemList,
    resetReturnItemList,
    resetExchangeItemList,
  } = usePOSStore();

  // console.log(exchangeItemList, "from pos form");

  const componentRef = React.useRef(null);
  const branch = useStore(useBranch, (state) => state.branch);
  const [selectedCharge, setSelectedCharge] = React.useState<number | null>(
    null
  );
  const [customDeliveryCharge, setCustomDeliveryCharge] = React.useState<
    number | ""
  >(0);
  const [exgDeliveryCharge, setExchangeDeliveryCharge] = React.useState<
    number | ""
  >(0);

  const handleDeliveryChargeChange = (charge: number) => {
    setSelectedCharge(charge);
    setDeliveryCharge(charge);
  };

  const handleCustomChargeInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    setCustomDeliveryCharge(isNaN(value) ? "" : value);
    setDeliveryCharge(isNaN(value) ? 0 : value);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const form = useForm<z.infer<typeof billFormSchema>>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      phone: order?.phone,
      name: order?.customer,
      address: order?.address,
    },
  });

  React.useEffect(() => {
    if (order) {
      form.reset({
        phone: order.phone || "",
        name: order.customer || "",
        address: order.address || "",
      });
    }
  }, [order, form]);

  React.useEffect(() => {
    if (order) {
      setCustomerData({
        id: order.ordersId,
        orderId: order.orderId,
        customerId: order.customerId,
      });
    }
  }, [order]);

  // console.log("orderdata before submission:", orderData);

  const calculateReceivableAmount = (
    newTotal: number,
    paidAmount: number
  ): number => {
    return newTotal - paidAmount;
  };

  const receivableAmount = calculateReceivableAmount(
    exgTotal,
    Number(order?.paid_amount)
  );

  const onSubmit = async (values: z.infer<typeof billFormSchema>) => {
    setLoading(true);
    const formData = makeFormData(values);

    calculateExgTotals();
    const currentTotal = usePOSStore.getState().exgTotal;

    try {
      await updateBillDetails(
        returnItemList,
        formData,
        currentTotal,
        branch,
        exchangeItemList,
        addExchangeItemList,
        customerData
      );
      setCustomerDetails(
        values.name || "",
        values.phone || "",
        values.address || ""
      );

      setDialogOpen(true);
    } catch (error: any) {
      // console.error(error);
      toast({
        title: "Failed to create Bill",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      resetExchangeItemList();
      resetAddExchangeItemList();
      resetReturnItemList();
      form.reset();
      setCustomerDetails("", "", "");
    }
  };

  const handlePaymentAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const amount = parseFloat(event.target.value) || 0;
    setPaymentAmount(amount);

    const calculatedDue = exgTotal - amount;
    if (calculatedDue > 0) {
      setDueAmount(calculatedDue);
      setChangeAmount(0);
    } else {
      setDueAmount(0);
      setChangeAmount(Math.abs(calculatedDue));
    }
  };

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-1">
        <p className="font-semibold">Bill Details</p>
        {order && (
          <div>
            <p className="text-base font-normal opacity-80">
              #{order.orderId}
            </p>
          </div>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="mb-[-12px]">
                <FormControl>
                  <Input placeholder="Enter Customer Phone Number" {...field} />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.phone?.message}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-[-12px]">
                <div className="flex justify-between items-center">
                  <FormLabel className="flex justify-between">Name</FormLabel>
                </div>
                <FormControl>
                  <Input placeholder="Enter Customer Name" {...field} />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.name?.message}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="mb-[-12px]">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter Customer Address" {...field} />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.address?.message}
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Card className="h-16 flex flex-col justify-center items-start pl-3">
              <p>Subtotal</p>
              <CardTitle>৳{subExgTotal}</CardTitle>
            </Card>
            <Card className="h-16 flex flex-col justify-center items-start pl-3">
              <p>Discount</p>
              <CardTitle>৳{order?.discount}</CardTitle>
            </Card>
            {/* <Card className="opacity-50">
              <CardHeader>
                <p>VAT</p>
                <CardTitle>৳{vatRate || order?.vat}</CardTitle>
              </CardHeader>
            </Card> */}
            <Card className="h-16 flex flex-col justify-center items-start pl-3">
              <p>Delivery</p>
              <CardTitle>৳{order?.delivery_charge}</CardTitle>
            </Card>
            <Card className="h-16 flex flex-col justify-center items-start pl-3">
              <p>QTY</p>
              <CardTitle>{totalExgQty}</CardTitle>
            </Card>
            <Card className="h-16 flex flex-col justify-center items-start pl-3">
              <p>Paid</p>
              <CardTitle>৳{order?.total}</CardTitle>
            </Card>
            <Card className="bg-black text-white h-16 flex flex-col justify-center items-start pl-3">
              <p>Delivery</p>
              <CardTitle>{selectedCharge || 0}</CardTitle>
            </Card>
            {/* <Card className="bg-[#007A12] text-white h-16 flex flex-col justify-center items-start pl-3">
              <p>Total</p>
              <CardTitle>৳{exgTotal}</CardTitle>
            </Card> */}
            <Card className="bg-[#007A12] text-white h-16 flex flex-col justify-center items-start pl-3">
              <p>Receivable</p>
              <CardTitle>৳{receivableAmount}</CardTitle>
            </Card>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="flex flex-col justify-center items-center gap-2 ">
              {/* <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <BadgePercent size={18} />
                  </Button>
                </DialogTrigger>
                <p className="text-sm">Discount</p>
              </Dialog> */}
            </div>

            <div className="flex flex-col justify-center items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Award size={18} />
                  </Button>
                </DialogTrigger>
                <p className="text-sm">Membership</p>
              </Dialog>
            </div>

            <div className="flex flex-col justify-center items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <TruckIcon size={18} />
                  </Button>
                </DialogTrigger>
                <p className="text-sm">Delivery</p>
                <DialogContent className="max-w-[95vw] sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Select Delivery Charge:</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <div className="flex flex-col">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <Card
                          className={`cursor-pointer ${
                            selectedCharge === 0 ? "bg-gray-300" : ""
                          }`}
                          onClick={() => handleDeliveryChargeChange(0)}
                        >
                          <CardHeader>
                            <CardTitle>$0</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card
                          className={`cursor-pointer ${
                            selectedCharge === 80 ? "bg-gray-300" : ""
                          }`}
                          onClick={() => handleDeliveryChargeChange(80)}
                        >
                          <CardHeader>
                            <CardTitle>$80</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card
                          className={`cursor-pointer ${
                            selectedCharge === 100 ? "bg-gray-300" : ""
                          }`}
                          onClick={() => handleDeliveryChargeChange(100)}
                        >
                          <CardHeader>
                            <CardTitle>$100</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card
                          className={`cursor-pointer ${
                            selectedCharge === 120 ? "bg-gray-300" : ""
                          }`}
                          onClick={() => handleDeliveryChargeChange(120)}
                        >
                          <CardHeader>
                            <CardTitle>$120</CardTitle>
                          </CardHeader>
                        </Card>
                      </div>

                      <div className="mt-4">
                        <Input
                          placeholder="Enter custom delivery charge"
                          value={customDeliveryCharge}
                          onChange={handleCustomChargeInputChange}
                        />
                      </div>
                    </div>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Button
              type="submit"
              variant="default"
              loading={loading}
              onChange={() => setDialogOpen(false)}
            >
              Proceed to Checkout
            </Button>
          </div>
        </form>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center font-bold">
                Payment Details
              </DialogTitle>
            </DialogHeader>
            <div className="">
              <Card className="flex w-full justify-center items-center py-2 cursor-pointer bg-black text-white">
                <p className="text-2xl">${exgTotal}</p>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 py-1 sm:grid-cols-2">
              <div className="py-1 px-3 bg-[#F4F4F4] rounded-md">
                <p className="text-xs">DUE</p>
                <h1 className="text-red-500 text-xl">${dueAmount}</h1>
              </div>
              <div className="py-1 px-3 bg-[#F4F4F4] rounded-md">
                <p className="text-xs">CHANGE</p>
                <h1 className="text-green-500 text-xl">${changeAmount}</h1>
              </div>
            </div>
            <DialogHeader>
              <DialogTitle className="text-center font-bold">
                Payment Mode
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Payment Method</SelectLabel>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <input
                type="text"
                placeholder="Enter amount"
                value={paymentAmount}
                onChange={handlePaymentAmountChange}
                className="border border-black rounded-md px-4"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handlePrint}>
                Print and save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Form>

      {/* <div className="hidden">
        <DeliverySlip
          ref={componentRef}
          orderData={orderData}
          items={exchangeItemList}
          subtotal={subtotal}
          totalExgQty={totalExgQty}
          total={total}
        />
      </div> */}
    </>
  );
};
