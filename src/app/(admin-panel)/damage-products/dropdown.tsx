"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Eye, Receipt, ReceiptText } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { SalesData, Settings } from "@/types/shared";
import { useBranch } from "@/hooks/store/use-branch";
import { useRouter } from "next/navigation";
import { useStore } from "zustand";
import { POSItem } from "../pos/item-selector";

interface Prop {
  damage_product: POSItem;
}

export const DamageProductsDropdown: React.FC<Prop> = ({ damage_product }) => {
  const printerRef = React.useRef<HTMLDivElement>(null);
  const slipPrinterRef = React.useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [orderData, setOrderData] = React.useState<POSItem[] | null>(null);
  const [isOrderDataLoading, setIsOrderDataLoading] = React.useState(false);
  const [settingsData, setSettingsData] = React.useState<Settings>();

  const { toast } = useToast();
  const branch = useStore(useBranch, (state) => state.branch);
  const router = useRouter();

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
          <DropdownMenuItem onClick={() => {}} className="cursor-pointer">
            <Eye size={16} />
            <span className="ml-2">View Order</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}} className="cursor-pointer">
            <ReceiptText size={16} />
            <span className="ml-2">Delivery Slip</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}} className="cursor-pointer">
            <Receipt size={16} />
            <span className="ml-2">POS Invoice</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
