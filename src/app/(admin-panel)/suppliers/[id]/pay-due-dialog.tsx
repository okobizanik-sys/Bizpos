"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getPaymentMethods } from "@/services/payment-method";
import type { PaymentMethods } from "@/types/shared";
import { makeBDPrice } from "@/utils/helpers";
import { paySupplierDue } from "./action";

type Props = {
  supplierId: number;
  purchaseId: number;
  dueAmount?: number;
};

export default function SupplierPayDueDialog({
  supplierId,
  purchaseId,
  dueAmount,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const maxDue = Number(dueAmount || 0);

  const [open, setOpen] = React.useState(false);
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethods[]>([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = React.useState(false);
  const [paymentMethodsLoadError, setPaymentMethodsLoadError] = React.useState<
    string | null
  >(null);
  const [paymentMethod, setPaymentMethod] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState(false);

  const paymentMethodOptions = React.useMemo(() => {
    const normalize = (value: string) => value.trim().toLowerCase();

    const fromDb = paymentMethods
      .map((method) => String(method.name || "").trim())
      .filter(Boolean)
      .filter((name) => {
        const normalized = normalize(name);
        return normalized !== "cash on delivery" && normalized !== "cod";
      });

    const fromDbByNormalized = new Map<string, string>();
    for (const name of fromDb) {
      const normalized = normalize(name);
      if (!fromDbByNormalized.has(normalized)) fromDbByNormalized.set(normalized, name);
    }

    const ensureFirst = ["Cash"];
    const seen = new Set<string>();
    const merged: string[] = [];

    for (const name of ensureFirst) {
      const normalized = normalize(name);
      const displayName = fromDbByNormalized.get(normalized) ?? name;
      if (seen.has(normalized)) continue;
      merged.push(displayName);
      seen.add(normalized);
    }

    for (const name of fromDb) {
      const normalized = normalize(name);
      if (seen.has(normalized)) continue;
      merged.push(name);
      seen.add(normalized);
    }

    return merged;
  }, [paymentMethods]);

  React.useEffect(() => {
    if (!open) return;
    setAmount(String(dueAmount || 0));
    setPaymentMethodsLoadError(null);
    setPaymentMethodsLoading(true);

    getPaymentMethods()
      .then((data) => setPaymentMethods(data))
      .catch(() => {
        setPaymentMethods([]);
        setPaymentMethodsLoadError("Failed to load payment methods.");
      })
      .finally(() => setPaymentMethodsLoading(false));
  }, [open, dueAmount]);

  const handleSubmit = async () => {
    const parsedAmount = Number(amount);

    if (!paymentMethod.trim()) {
      toast({
        title: "Payment method required",
        variant: "destructive",
      });
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (parsedAmount > maxDue) {
      toast({
        title: "Amount exceeds due",
        description: `Max payable is ${makeBDPrice(maxDue)}.`,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await paySupplierDue(supplierId, purchaseId, {
        amount: parsedAmount,
        paymentMethod,
      });
      toast({ title: "Due payment recorded." });
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Failed to pay due",
        description: error?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" onClick={() => setOpen(true)}>
        Pay Due
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center font-bold">
            Pay Supplier Due
          </DialogTitle>
        </DialogHeader>

        <Card className="flex w-full justify-center items-center py-2 bg-black text-white">
          <p className="text-2xl">{makeBDPrice(maxDue)}</p>
        </Card>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Payment Method</label>
            <Select onValueChange={setPaymentMethod} value={paymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethodsLoading ? (
                  <div className="px-2 py-1 text-sm text-muted-foreground">
                    Loading payment methods...
                  </div>
                ) : paymentMethodsLoadError ? (
                  <div className="px-2 py-1 text-sm text-destructive">
                    {paymentMethodsLoadError}
                  </div>
                ) : paymentMethodOptions.length === 0 ? (
                  <div className="px-2 py-1 text-sm text-muted-foreground">
                    No payment methods found. Add one from Settings.
                  </div>
                ) : (
                  paymentMethodOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to pay"
            />
            <p className="text-xs text-muted-foreground">
              Max payable: {makeBDPrice(maxDue)}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="default"
            loading={submitting}
            disabled={submitting}
            onClick={handleSubmit}
          >
            Submit Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
