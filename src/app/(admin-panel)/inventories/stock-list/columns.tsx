import { ColumnDef } from "@tanstack/react-table";
import { ProductWithStockPayload } from "./page";
import { makePrice, makeProductCode } from "@/utils/helpers";
import { StockDetails } from "./details";
import Barcode from "react-barcode";
// import { StockDetails } from "./details";

const calculateStockValue = (product: ProductWithStockPayload) => {
  return Math.round(product.cost * product.quantity);
};

const calculateSellValue = (product: ProductWithStockPayload) => {
  return Math.round(product.selling_price * product.quantity);
};

export const columns: ColumnDef<ProductWithStockPayload>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Barcode",
    accessorKey: "barcode",
    // accessorFn: (row) => makeProductCode(Number(row.barcode)),
    cell: ({ row }) => {
      return (
        <div>
          {/* <Barcode value={row.original.barcode} width={3.5} height={49} /> */}
          <p>{row.original.barcode}</p>
        </div>
      );
    },
  },
  {
    header: "Product Name",
    accessorKey: "name",
  },
  {
    header: "Variant",
    accessorFn: (row) => `${row.colorName} ~ ${row.sizeName}`,
    cell: ({ row }) => (
      <p>
        {row.original.colorName} ~ {row.original.sizeName}
      </p>
    ),
  },
  {
    header: "Category",
    accessorKey: "categoryName",
  },
  {
    header: "In Stock",
    accessorKey: "quantity",
  },
  {
    header: "Stock Value",
    accessorKey: "cost",
    // accessorFn: (row) => calculateStockValue(row),
    cell: ({ row }) => calculateStockValue(row.original),
  },
  {
    header: "Sell Value",
    accessorKey: "selling_price",
    // accessorFn: (row) => calculateSellValue(row),
    cell: ({ row }) => calculateSellValue(row.original),
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <StockDetails product={row.original} />;
    },
  },
];
