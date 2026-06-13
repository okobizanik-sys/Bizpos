import { ColumnDef } from "@tanstack/react-table";
import { DamageProductsDropdown } from "./dropdown";
import { POSItem } from "../pos/item-selector";

export const columns: ColumnDef<POSItem>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Item Code",
    accessorKey: "itemCode",
  },
  {
    header: "Barcode",
    accessorKey: "barcode",
  },
  {
    header: "Product Name",
    accessorKey: "productName",
  },
  {
    header: "Category",
    accessorKey: "categoryName",
  },
  {
    header: "SKU",
    accessorKey: "sku",
  },
  {
    header: "Stock Value",
    accessorKey: "stockValue",
  },
  {
    header: "Cell Value",
    accessorKey: "supplierName",
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <DamageProductsDropdown damage_product={row.original} />;
    },
  },
];
