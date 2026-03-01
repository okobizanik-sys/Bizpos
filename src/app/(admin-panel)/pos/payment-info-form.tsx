"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { makeFormData } from "@/utils/helpers";
import { updatePaymentInfo } from "./action";
import DeliverySlip from "@/components/delivery-slip/page";
import { Branches, Orders, PaymentMethods } from "@/types/shared";
import { OrderWithItem, POSItem } from "./item-selector";
import { OrderInfo } from "./form";
import { useReactToPrint } from "react-to-print";
import { getPaymentMethods } from "@/services/payment-method";
import PrintInvoice from "@/components/invoice/page";
import { getOrderByIdWithItems, getOrderByOrderId } from "@/services/order";
import { TotalsOfOrder } from "../orders/orders-list/dropdown";

interface Props {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<boolean>;
  total: number;
  orderId: string;
  componentRef: React.RefObject<HTMLDivElement>;
  orderData: OrderInfo;
  itemList: POSItem[];
  totalQty: number;
  branch: Branches;
}

const paymentFormSchema = z.object({
  paymentMethod: z.string().min(1, "Please select a payment method."),
  advanceAmount: z.number().min(0, "Amount must be non-negative."),
  dueAmount: z.number().min(0, "Due amount must be non-negative."),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const AdvancedPaymentForm: React.FC<Props> = ({
  dialogOpen,
  setDialogOpen,
  total,
  orderId,
  componentRef,
  orderData,
  itemList,
  totalQty,
  branch,
}) => {
  const { toast } = useToast();
  const printerRef = React.useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [cod, setCod] = React.useState<number>(total);
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethods[]>(
    []
  );
  const [order, setOrder] = React.useState<Orders>();
  const [printDeliverySlip, setPrintDeliverySlip] =
    React.useState<boolean>(false);
  const [printInvoice, setPrintInvoice] = React.useState<boolean>(false);
  const [orderTotalData, setOrderData] = React.useState<OrderWithItem[] | null>(
    []
  );

  console.log(orderId, order, "order from payment info form ...............");

  React.useEffect(() => {
    getPaymentMethods().then((data) => setPaymentMethods(data));
  }, []);

  React.useEffect(() => {
    getOrderByOrderId(orderId).then((data) => setOrder(data));

    getOrderByIdWithItems({
      where: { "orders.order_id": orderId },
    }).then((data) => {
      setOrderData(data);
    });
  }, [printInvoice, orderId]);

  // console.log(orderId, "orderId from payment");
  // console.log(order, "order from payment");

  const totals: TotalsOfOrder[] | undefined = orderTotalData?.map(
    (orderItem) => {
      return orderItem.items.reduce(
        (acc: any, item) => {
          acc.stockValue += Number(item.cost || 0);
          acc.sellValue += Number(item.sellingPrice || 0);
          acc.quantity += Number(item.quantity || 0);
          return acc;
        },
        { stockValue: 0, sellValue: 0, quantity: 0 }
      );
    }
  );

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "",
      advanceAmount: 0,
      dueAmount: 0,
    },
  });

  React.useEffect(() => {
    form.setValue("dueAmount", total);
  }, [total, form]);

  // Make sure cod is updated when total changes
  React.useEffect(() => {
    setCod(total);
  }, [total]);

  const calculateDueAmount = (advance: number, total: number) => {
    const due = Math.max(total - advance, 0);
    setCod(due);
    return due;
  };

  const handleDeliverySlipPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleInvoicePrinter = useReactToPrint({
    content: () => printerRef.current,
  });

  const handleSubmit = async (values: PaymentFormValues) => {
    // Mock action or API call
    // console.log("Payment Data Submitted:", values);
    const formData = makeFormData(values);
    try {
      const result = await updatePaymentInfo(orderId, formData);
      if (result) {
        toast({ title: "Payment submitted successfully!", variant: "default" });
        setDialogOpen(false);
        form.reset();

        if (printDeliverySlip) {
          handleDeliverySlipPrint();
          setPrintDeliverySlip(false);
        }
        if (printInvoice) {
          handleInvoicePrinter();
          setPrintInvoice(false);
        }
        setTimeout(() => {
          window.location.reload();
        }, 7000);
      }
    } catch (error: any) {
      toast({
        title: "Failed to submit payment!",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAdvanceChange = (value: string, total: number) => {
    const advance = parseFloat(value) || 0;
    form.setValue("advanceAmount", advance);
    form.setValue("dueAmount", calculateDueAmount(advance, total));
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* <DialogTrigger asChild>
        <Button>Open Payment Form</Button>
      </DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center font-bold">
              Payment Details
            </DialogTitle>
          </DialogHeader>
          <div className="">
            <Card className="flex w-full justify-center items-center py-2 cursor-pointer bg-black text-white">
              <p className="text-2xl">৳{total}</p>
            </Card>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {(paymentMethods.length === 0 && (
                            <p>Loading payment methods...</p>
                          )) ||
                            paymentMethods.map((method) => (
                              <SelectItem
                                key={method.id}
                                value={method.name}
                                className="hover:bg-black hover:text-white transition-all duration-400"
                              >
                                {method.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="advanceAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advance Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter advance amount"
                        {...field}
                        onChange={(e) =>
                          handleAdvanceChange(e.target.value, total)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        readOnly
                        placeholder="Calculated due amount"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  variant="default"
                  loading={loading}
                  onClick={() => setPrintDeliverySlip(true)}
                >
                  Submit & Print Delivery Slip
                </Button>

                <Button
                  type="submit"
                  variant="default"
                  loading={loading}
                  onClick={() => setPrintInvoice(true)}
                >
                  Submit & Print Invoice
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="hidden">
        <DeliverySlip
          ref={componentRef}
          orderData={orderData}
          items={itemList}
          totalQty={totalQty}
          cod={cod}
          existingBranch={branch}
        />
      </div>

      {/* Print Invoice */}
      <div className="hidden">
        {order && (
          <PrintInvoice
            ref={printerRef}
            orderData={orderTotalData || []}
            order={order}
            existingBranch={branch}
            totals={totals}
          />
        )}
      </div>
    </>
  );
};
