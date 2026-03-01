"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { makeProductCode } from "@/utils/helpers";
import { confirmation } from "@/components/modals/confirm-modal";
import { useToast } from "@/components/ui/use-toast";
import { deleteChallanAction } from "./action";
import { ChallanGetPayload, ChallanItems, ChallanList } from "@/types/shared";
import { getChallanItems } from "@/services/challan";
import { formatDate } from "date-fns";

interface Prop {
  challans: ChallanGetPayload;
}

export const TransferDetails: React.FC<Prop> = ({ challans }) => {
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [challanItems, setChallanItems] = React.useState<ChallanItems[]>([]);

  // console.log(status, challanId, challanItems, "from challan details");
  const challanId = Number(challans.id);

  React.useEffect(() => {
    getChallanItems({ where: { challan_id: BigInt(challanId) } }).then((data) =>
      setChallanItems(data)
    );
  }, []);

  const handleDeleteChallan = async () => {
    if (await confirmation("Are you sure you want to delete this challan?")) {
      setLoading(true);
      try {
        await deleteChallanAction(BigInt(challanId));
        setSheetOpen(false);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full overflow-y-auto sm:max-w-[750px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="mb-4">
          <SheetTitle>Challan Items</SheetTitle>
        </SheetHeader>

        <p>Challan No.: {challans.challan_no}</p>
        <p>Form: {challans.from_branch_name}</p>
        <p>To: {challans.to_branch_name}</p>
        <p>
          Received at: {formatDate(String(challans.updated_at), "dd/MM/yyyy")}
        </p>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Qty</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {challanItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="py-2">{index + 1}</TableCell>
                <TableCell className="py-2">{item.barcode}</TableCell>
                <TableCell className="py-2">
                  {makeProductCode(Number(item.product_id))}
                </TableCell>
                <TableCell className="py-2">{item.name}</TableCell>
                <TableCell className="py-2">{item.variant}</TableCell>
                <TableCell className="py-2">{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <SheetFooter className="mt-4 flex justify-end">
          <Button
            disabled={challans.status === "RECEIVED"}
            variant="destructive"
            onClick={handleDeleteChallan}
            loading={loading}
          >
            Delete
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
