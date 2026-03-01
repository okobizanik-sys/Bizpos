"use client";

import React from "react";
import { ProductSelector } from "../inventories/add-stock/product-selector";
import { getProduct, getProducts } from "@/services/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { makeProductCode } from "@/utils/helpers";
import { ProductList } from "../inventories/products/columns";
import { Branches, Colors, Sizes, Stocks } from "@/types/shared";
import { useToast } from "@/components/ui/use-toast";

interface Stock extends Stocks {
  size: Sizes;
  color: Colors;
  branch: Branches;
}

interface Product extends ProductList {
  stocks: Stock[];
}

export const GlobalStockView: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(
    null
  );

  const [product, setProduct] = React.useState<Product>();
  const [products, setProducts] = React.useState<ProductList[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    getProducts({}).then((data) => setProducts(data.products));
  }, []);

  React.useEffect(() => {
    if (selectedProduct) {
      getProduct({
        where: { id: Number(selectedProduct) },
      }).then((product) => {
        setProduct(product);
      });
    }
  }, [selectedProduct]);

  const stocks = product?.stocks || [];

  type Stock = {
    barcode: string;
    branch: { name: string };
    color?: { name: string };
    size?: { name: string };
    quantity: number;
  };

  // Update function to properly type `acc` and `stock`
  const stocksGroupedByBranch = stocks.reduce(
    (
      acc: Record<string, Record<string, { count: number; stocks: Stock[] }>>,
      stock: Stock
    ) => {
      const branchName = stock.branch.name;

      // Initialize the branch grouping if it doesn't exist
      if (!acc[branchName]) {
        acc[branchName] = {};
      }

      // Initialize the barcode grouping within the branch if it doesn't exist
      if (!acc[branchName][stock.barcode]) {
        acc[branchName][stock.barcode] = { count: 0, stocks: [] };
      }

      // Increment the count for this barcode within this branch
      acc[branchName][stock.barcode].count += 1;
      acc[branchName][stock.barcode].stocks.push(stock);

      return acc;
    },
    {} as Record<string, Record<string, { count: number; stocks: Stock[] }>>
  );

  React.useEffect(() => {
    if (product === null && selectedProduct) {
      toast({
        title: "Stocks Empty!",
        description: `No product of this item found in the stock.`,
        variant: "destructive",
      });
    }
  }, [product, selectedProduct, toast]);
  // console.log(product);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold">Search Product</span>
        <ProductSelector
          products={products}
          selectedProduct={selectedProduct}
          setSelectProduct={setSelectedProduct}
        />
      </div>
      {product && (
        <>
          <div className="col-span-2">
            <Table className="rounded-lg overflow-hidden">
              <TableHeader className="bg-primary">
                <TableRow>
                  <TableHead className="text-white h-8">Code</TableHead>
                  <TableHead className="text-white h-8">Name</TableHead>
                  <TableHead className="text-white h-8">SKU</TableHead>
                  <TableHead className="text-white h-8">Category</TableHead>
                  <TableHead className="text-white h-8">In Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="px-4 py-2">
                    {makeProductCode(product.id)}
                  </TableCell>
                  <TableCell className="px-4 py-2">{product.name}</TableCell>
                  <TableCell className="px-4 py-2">{product.sku}</TableCell>
                  <TableCell className="px-4 py-2">
                    {product.categoryName}
                  </TableCell>
                  {/* <TableCell className="px-4 py-2">
                    {product.quantity}
                  </TableCell> */}
                  <TableCell className="px-4 py-2">
                    {product.stocks.reduce(
                      (total, stock) => total + stock.quantity,
                      0
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="col-span-2">
            <Table className="rounded-lg overflow-hidden">
              <TableHeader className="bg-primary">
                <TableRow>
                  <TableHead className="text-white h-8">Barcode</TableHead>
                  <TableHead className="text-white h-8">Variant</TableHead>
                  <TableHead className="text-white h-8">Branches</TableHead>
                  <TableHead className="text-white h-8">In Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(stocksGroupedByBranch).map(
                  ([branch, barcodes]) => {
                    return Object.entries(barcodes).map(
                      ([barcode, { count, stocks }], index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell className="px-4 py-2">
                              {barcode}
                            </TableCell>
                            <TableCell className="px-4 py-2">
                              {stocks[0].color?.name} - {stocks[0].size?.name}
                            </TableCell>
                            <TableCell className="px-4 py-2">
                              {branch}
                            </TableCell>
                            <TableCell className="px-4 py-2">
                              {stocks[0].quantity}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    );
                  }
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};
