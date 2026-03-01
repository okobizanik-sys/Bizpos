"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { billFormSchema } from "./form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeFormData } from "@/utils/helpers";
import { createBillDetails } from "./action";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { usePOSStore } from "@/hooks/store/use-pos-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useReactToPrint } from "react-to-print";
import DeliverySlip from "@/components/delivery-slip/page";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  BadgePercent,
  CircleAlert,
  CircleCheckBig,
  TruckIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "zustand";
import { useBranch } from "@/hooks/store/use-branch";
import { getCustomers, getCustomersWithOrders } from "@/services/customer";
import { Customers, CustomerWithOrders } from "@/types/shared";
import { PhoneSelector } from "@/components/admin-panel/phone-selector";
import { FaCircleCheck } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";
import { AdvancedPaymentForm } from "./payment-info-form";
import { Label } from "@/components/ui/label";

const defaultValues = {
  phone: "",
  name: "",
  address: "",
};

export type OrderInfo = {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
};

export const BillDetailsForm: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [orderData, setOrderData] = React.useState({
    orderId: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    date: "",
  });
  const [paymentAmount, setPaymentAmount] = React.useState(0);
  const [dueAmount, setDueAmount] = React.useState(0);
  const [changeAmount, setChangeAmount] = React.useState(0);

  const { toast } = useToast();
  const {
    subtotal,
    totalQty,
    discount,
    deliveryCharge,
    vatRate,
    total,
    setCustomerDetails,
    itemList,
    setDeliveryCharge,
    setDiscountAmount,
    setBdtDiscountAmount,
    resetItemList,
    orderId,
  } = usePOSStore();

  const componentRef = React.useRef(null);
  const branch = useStore(useBranch, (state) => state.branch);
  const [customers, setCustomers] = React.useState<Customers[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customers | null>(null);
  const [customerData, setCustomerData] = React.useState<CustomerWithOrders[]>(
    []
  );
  const [selectedCharge, setSelectedCharge] = React.useState<number | null>(
    null
  );
  const [customDeliveryCharge, setCustomDeliveryCharge] = React.useState<
    number | ""
  >(0);
  const [selectedDiscount, setSelectedDiscount] = React.useState<number | null>(
    null
  );
  const [customDiscount, setCustomDiscount] = React.useState<number | "">(0);
  const [customBdtDiscount, setCustomBdtDiscount] = React.useState<number | "">(
    0
  );
  // console.log(customerData, "customer data from pos form");

  const handleDeliveryChargeChange = (charge: number) => {
    setSelectedCharge(charge);
    setDeliveryCharge(charge);
  };

  // const handleDiscountChange = (charge: number) => {
  //   setSelectedDiscount(charge);
  //   setDiscountAmount(charge);
  // };
  const handleDiscountChange = (charge: number) => {
    setSelectedDiscount((prev) => (prev === charge ? 0 : charge));
    setDiscountAmount(charge);
  };

  const handleCustomChargeInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    setCustomDeliveryCharge(isNaN(value) ? "" : value);
    setDeliveryCharge(isNaN(value) ? 0 : value);
  };

  const handleCustomDiscountInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    setCustomDiscount(isNaN(value) ? "" : value);
    setDiscountAmount(isNaN(value) ? 0 : value);
  };

  const handleCustomDiscountBdtInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    setCustomBdtDiscount(isNaN(value) ? "" : value);
    setBdtDiscountAmount(isNaN(value) ? 0 : value);
  };

  React.useEffect(() => {
    if (branch) {
      getCustomers({ where: {} }).then((data) => {
        setCustomers(data);
      });
    }
  }, [branch]);

  const form = useForm<z.infer<typeof billFormSchema>>({
    resolver: zodResolver(billFormSchema),
    defaultValues,
  });

  React.useEffect(() => {
    if (selectedCustomer !== null) {
      form.setValue("name", selectedCustomer.customer);
      form.setValue("address", selectedCustomer.address);

      getCustomersWithOrders({
        where: { "customers.id": selectedCustomer?.id },
      }).then((data) => setCustomerData(data));
    }
  }, [selectedCustomer, form]);

  const calculateDiscountAmount = (discount: number) => {
    return Math.round((subtotal * discount) / 100);
  };

  const discountAmount = calculateDiscountAmount(discount);

  const onSubmit = async (values: z.infer<typeof billFormSchema>) => {
    setLoading(true);
    const formData = makeFormData(values);

    const currentTotal = usePOSStore.getState().total;

    const orderData = {
      orderId: orderId,
      customerName: values.name || "",
      customerPhone: values.phone,
      customerAddress: values.address || "",
      date: new Date().toISOString().split("T")[0],
    };

    try {
      await createBillDetails(
        formData,
        currentTotal,
        branch,
        itemList,
        orderId,
        deliveryCharge,
        discountAmount,
        Number(customBdtDiscount),
        subtotal
      );
      setCustomerDetails(
        values.name || "",
        values.phone || "",
        values.address || ""
      );
      setOrderData(orderData);
      setDialogOpen(true);

      form.reset();
      // resetItemList();
    } catch (error: any) {
      // console.error(error);
      toast({
        title: "Failed to create Bill",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handlePaymentAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const amount = parseFloat(event.target.value) || 0;
    setPaymentAmount(amount);

    const calculatedDue = total - amount;
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className=" relative">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <FormLabel className="flex justify-between">Phone</FormLabel>
                  {customerData &&
                    customerData.map((data, index) => (
                      <div
                        key={index}
                        className="flex w-full justify-between gap-2 sm:w-2/3"
                      >
                        <p className="opacity-70 text-sm">
                          Return: <span>{data.return}</span>
                        </p>
                        <p className="opacity-70 text-sm">
                          Total Order: <span>{data.orders}</span>
                        </p>
                      </div>
                    ))}
                </div>
                {selectedCustomer &&
                  (selectedCustomer?.fraud === "true" ? (
                    <IoWarning className="absolute z-30 right-0 top-0 -translate-x-9 translate-y-8 text-rose-600" />
                  ) : (
                    <FaCircleCheck className="absolute z-30 right-0 top-0 -translate-x-9 translate-y-8 text-green-700" />
                  ))}
                <FormControl>
                  <PhoneSelector
                    customers={customers}
                    setSelectedCustomer={setSelectedCustomer}
                    onChange={(phone) => {
                      form.setValue("phone", phone);
                    }}
                  />
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
              <FormItem className="">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <FormLabel className="flex justify-between">Name</FormLabel>
                  {selectedCustomer?.groupName && (
                    <div className="flex w-full justify-end sm:w-1/2">
                      <p className="opacity-70 text-sm">
                        Group: <span>{selectedCustomer.groupName}</span>
                      </p>
                    </div>
                  )}
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
              <FormItem className="">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className=" flex flex-col justify-center items-start p-3 gap-3 bg-[#F4F4F4]">
              <p className="text-xs text-[#828282]">Subtotal</p>
              <CardTitle className="text-xl">৳{subtotal}</CardTitle>
            </Card>
            <Card className=" flex flex-col justify-center items-start p-3 gap-3 bg-[#F4F4F4]">
              <p className="text-xs text-[#828282]">Discount</p>
              <CardTitle className="text-xl">
                {discountAmount || customBdtDiscount}
              </CardTitle>
            </Card>
            {/* <Card className="opacity-50">
              <CardHeader>
                <p>VAT</p>
                <CardTitle className="text-xl">৳{vatRate}</CardTitle>
              </CardHeader>
            </Card> */}
            <Card className=" flex flex-col justify-center items-start p-3 gap-3 bg-[#F4F4F4]">
              <p className="text-xs text-[#828282]">Delivery</p>
              <CardTitle className="text-xl">৳{deliveryCharge}</CardTitle>
            </Card>
            <Card className="bg-black text-white flex flex-col justify-center items-start p-3 gap-3">
              <p className="text-xs">QTY</p>
              <CardTitle className="text-xl">{totalQty}</CardTitle>
            </Card>
            <Card className="bg-[#007A12] text-white flex flex-col justify-center items-start p-3 gap-3">
              <p className="text-xs">Total</p>
              <CardTitle className="text-xl">৳{total}</CardTitle>
            </Card>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="flex flex-col justify-center items-center gap-2 h-16 ">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex flex-col">
                    <BadgePercent size={18} />
                  </Button>
                </DialogTrigger>
                <p className="text-sm">Discount</p>
                <DialogContent className="max-w-[95vw] sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Select Discount Amount:</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <div className="flex flex-col">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <Card
                          className={`cursor-pointer ${
                            selectedDiscount === 5
                              ? "bg-black text-white transition-all duration-400"
                              : ""
                          }`}
                          onClick={() => handleDiscountChange(5)}
                        >
                          <CardHeader>
                            <CardTitle>5%</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card
                          className={`cursor-pointer ${
                            selectedDiscount === 10
                              ? "bg-black text-white transition-all duration-400"
                              : ""
                          }`}
                          onClick={() => handleDiscountChange(10)}
                        >
                          <CardHeader>
                            <CardTitle>10%</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card
                          className={`cursor-pointer ${
                            selectedDiscount === 15
                              ? "bg-black text-white transition-all duration-400"
                              : ""
                          }`}
                          onClick={() => handleDiscountChange(15)}
                        >
                          <CardHeader>
                            <CardTitle>15%</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card
                          className={`cursor-pointer ${
                            selectedDiscount === 20
                              ? "bg-black text-white transition-all duration-400"
                              : ""
                          }`}
                          onClick={() => handleDiscountChange(20)}
                        >
                          <CardHeader>
                            <CardTitle>20%</CardTitle>
                          </CardHeader>
                        </Card>
                      </div>

                      <div className="mt-4">
                        <Label>Enter Discount Rate (%)</Label>
                        <Input
                          placeholder="Enter custom discount (%) "
                          value={customDiscount}
                          onChange={handleCustomDiscountInputChange}
                        />
                      </div>
                      <div className="mt-4">
                        <Label>Enter Flat Discount (BDT)</Label>
                        <Input
                          placeholder="Enter custom discount (BDT) "
                          value={customBdtDiscount}
                          onChange={handleCustomDiscountBdtInputChange}
                        />
                      </div>
                    </div>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-col justify-center items-center gap-2 h-16">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex flex-col">
                    <Award size={18} />
                  </Button>
                </DialogTrigger>
                <p className="text-sm">Membership</p>
              </Dialog>
            </div>

            <div className="flex flex-col justify-center items-center gap-2 h-16">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex flex-col">
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
                            selectedCharge === 0
                              ? "bg-black text-white transition-all duration-400"
                              : ""
                          }`}
                          onClick={() => handleDeliveryChargeChange(0)}
                        >
                          <CardHeader>
                            <CardTitle>৳0</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card
                          className={`cursor-pointer ${
                            selectedCharge === 80
                              ? "bg-black text-white transition-all duration-400"
                              : ""
                          }`}
                          onClick={() => handleDeliveryChargeChange(80)}
                        >
                          <CardHeader>
                            <CardTitle>৳80</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card
                          className={`cursor-pointer ${
                            selectedCharge === 100
                              ? "bg-black text-white transition-all duration-400"
                              : ""
                          }`}
                          onClick={() => handleDeliveryChargeChange(100)}
                        >
                          <CardHeader>
                            <CardTitle>৳100</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card
                          className={`cursor-pointer ${
                            selectedCharge === 120
                              ? "bg-black text-white transition-all duration-400"
                              : ""
                          }`}
                          onClick={() => handleDeliveryChargeChange(120)}
                        >
                          <CardHeader>
                            <CardTitle>৳120</CardTitle>
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

        <AdvancedPaymentForm
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          total={total}
          orderId={orderId}
          componentRef={componentRef}
          orderData={orderData}
          itemList={itemList}
          totalQty={totalQty}
          branch={branch}
        />
      </Form>
    </>
  );
};
