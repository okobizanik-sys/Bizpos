"use client";

import { Card } from "@/components/ui/card";
import { useBranch } from "@/hooks/store/use-branch";
import {
  getCustomers,
  getUniqueCustomers,
  updateCustomer,
} from "@/services/customer";
import { Customers } from "@/types/shared";
import React from "react";
import { useStore } from "zustand";
import { CustomerSelector } from "./customer-selector";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@radix-ui/react-label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { makeFormData } from "@/utils/helpers";
import { useForm } from "react-hook-form";
import { CornerDownLeft, FileSpreadsheet, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import FraudCustomerSlip from "@/components/print-pages/fraud-customer-slip";
import { revalidatePath } from "next/cache";
import { confirmation } from "@/components/modals/confirm-modal";
import { notFraudFormAction } from "./action";

export default function FraudCustomersList() {
  const branch = useStore(useBranch, (state) => state.branch);
  const [customers, setCustomers] = React.useState<Customers[]>([]);
  const [fraudCustomers, setFraudCustomers] = React.useState<Customers[]>([]);
  const [customer, setCustomer] = React.useState<Customers[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [notFraud, setNotFraud] = React.useState<boolean>(false);
  const [code, setCode] = React.useState<string>();
  const { toast } = useToast();
  const form = useForm();
  const printerRef = React.useRef(null);

  const handlePrinter = useReactToPrint({
    content: () => printerRef.current,
  });

  // console.log(customer, "customer from fraud product page");

  React.useEffect(() => {
    if (branch) {
      getUniqueCustomers({ where: { fraud: "false" } }).then((data) => {
        setCustomers(data);
      });

      getCustomers({ where: { fraud: "true" } }).then((data) => {
        setFraudCustomers(data);
      });
    }
  }, [branch, notFraud]);

  const idSelected = (code: string | void | null) => {
    if (code) {
      setCode(code);
    }

    const selectedCustomer = customers.find((c) => String(c.id) === code);
    if (selectedCustomer) {
      setCustomer([...customer, selectedCustomer]);
    }
  };

  const confirmFraud = async (values: any) => {
    const formData = makeFormData(values);
    setLoading(true);
    try {
      let result;
      for (const c of customer) {
        const updatedCustomer = {
          ...c,
          fraud: "true",
          remarks: (formData.get("remarks") as string) || "",
        };

        const { groupName, membershipType, ...updatedCustomerNeeded } =
          updatedCustomer;
        const result = await updateCustomer(
          Number(c.id),
          updatedCustomerNeeded
        );
      }
      toast({
        title: "Success!",
        description: "Customer marked as fraud!",
        variant: "default",
      });

      setLoading(false);
      setDialogOpen(false);
      setCustomer([]);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleNotFraud = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const customerId = e.currentTarget.value;
    const notFraudCustomer = fraudCustomers.find(
      (item) => item.id === Number(customerId)
    );
    // console.log(found)
    if (
      await confirmation(
        "Are you sure you want to remove this customer from fraud list?"
      )
    ) {
      setNotFraud(true);
      if (notFraudCustomer) {
        const result = await notFraudFormAction(notFraudCustomer);
        if (result) {
          toast({
            title: "Fraud Customer removed successfully",
            description: `Customer has been removed successfully from fraud list`,
            variant: "default",
          });
        } else {
          toast({
            title: "Fraud Customer removed failed",
            description: `Customer has not been removed from fraud list`,
            variant: "destructive",
          });
        }
      }
    }
    setNotFraud(false);
  };

  return (
    <>
      <Card className="m-4 p-4 rounded-lg flex items-end justify-between">
        <div className="w-1/2">
          <Label>Select Customer</Label>
          <CustomerSelector
            customers={customers}
            setSelectedCustomer={idSelected}
          />
        </div>

        <Button
          className=""
          disabled={customer.length === 0}
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          Add Fraud Customer
        </Button>
      </Card>

      {customer.length > 0 && (
        <Card className="m-4 p-4 rounded-lg min-h-40">
          <Table className="rounded-lg overflow-hidden">
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="h-8 text-white">SL</TableHead>
                <TableHead className="h-8 text-white">Customer</TableHead>
                <TableHead className="h-8 text-white">Phone</TableHead>
                <TableHead className="h-8 text-white">Remarks</TableHead>
                {/* <TableHead className="h-8 text-white">Action</TableHead> */}
              </TableRow>
            </TableHeader>

            <TableBody>
              {customer.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="py-2">{index + 1}</TableCell>
                  <TableCell className="py-2">{item.customer}</TableCell>
                  <TableCell className="py-2">{item.phone}</TableCell>
                  <TableCell className="py-2">{item.remarks}</TableCell>
                  {/* <TableCell className="py-2">{}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Card className="m-4 p-4 rounded-lg min-h-96">
        <div className="flex gap-2 justify-end items-center my-1">
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-blue-400 text-blue-400 w-8 h-8"
            onClick={handlePrinter}
          >
            <Printer />
          </Button>
        </div>

        <Table className="rounded-lg overflow-hidden">
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className="h-8 text-white">SL</TableHead>
              <TableHead className="h-8 text-white">Customer</TableHead>
              <TableHead className="h-8 text-white">Phone</TableHead>
              <TableHead className="h-8 text-white">Remarks</TableHead>
              <TableHead className="h-8 text-white">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {fraudCustomers.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="py-2">{index + 1}</TableCell>
                <TableCell className="py-2">{item.customer}</TableCell>
                <TableCell className="py-2">{item.phone}</TableCell>
                <TableCell className="py-2">{item.remarks}</TableCell>
                <TableCell className="py-2">
                  <Button
                    onClick={handleNotFraud}
                    loading={notFraud}
                    value={String(item.id)}
                  >
                    <CornerDownLeft size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reason for return?</DialogTitle>
            <DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(confirmFraud)}
                  className="flex flex-col gap-3"
                >
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Describe reason to return..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="default" loading={loading}>
                    Submit
                  </Button>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="hidden">
        <FraudCustomerSlip
          existingBranch={branch}
          ref={printerRef}
          fraudCustomers={fraudCustomers}
        />
      </div>
    </>
  );
}
