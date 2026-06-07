"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ProductDetailSheet } from "./details";
import { fileUrlGenerator } from "@/utils/helpers";
import defaultImage from "@/assets/default_image-icon-600nw.webp";

export type ProductList = {
  id: number;
  name: string;
  sku: string;
  selling_price: number;
  description: string;
  image_id: number;
  category_id: number;
  brand_id: number;
  categoryName: string;
  brandName: string;
  imageUrl: string;
  quantity?: number;
  barcode?: string | null;
};

export const columns: ColumnDef<ProductList>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Image",
    accessorKey: "imageUrl",
    cell: ({ row }) => (
      <div>
        {row.original.imageUrl ? (
          <img
            src={row.getValue("imageUrl")}
            alt={row.getValue("name")}
            height={48}
            width={48}
            className="w-12 h-12 object-cover rounded-md"
          />
        ) : (
          <img
            src="/public/images/others/default_image-icon-600nw.webp"
            alt="default image"
            className="w-12 h-12 object-cover rounded-md"
          />
        )}
      </div>
    ),
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "name",
  },
  {
    header: "SKU",
    accessorKey: "sku",
  },
  {
    header: "Category",
    id: "category_id",
    accessorKey: "categoryName",
  },
  {
    header: "Selling Price",
    accessorKey: "selling_price",
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;
      return <ProductDetailSheet product={product} />;
    },
  },
];
