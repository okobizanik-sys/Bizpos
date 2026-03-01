import { notFound } from "next/navigation";
import db from "@/db/database";
import PrintLabelClient from "./print-label-client";
import "../../../../../../../styles/print-label.css";

interface Props {
  params: {
    id: string;
  };
}

export default async function PrintLabelPage({ params }: Props) {
  const productId = Number(params.id);

  if (isNaN(productId)) {
    notFound();
  }

  const product = await db("products")
    .select("id", "name", "selling_price")
    .where({ id: productId })
    .first();

  if (!product) {
    notFound();
  }

  // Fetch stocks.barcode — the real barcode used in POS and orders
  const stocks = await db("stocks")
    .where({ product_id: productId, condition: "new" })
    .leftJoin("colors", "stocks.color_id", "colors.id")
    .leftJoin("sizes", "stocks.size_id", "sizes.id")
    .select(
      "stocks.barcode",
      db.raw("COALESCE(colors.name, '-') as colorName"),
      db.raw("COALESCE(sizes.name, '-') as sizeName"),
    )
    .groupBy("stocks.barcode");

  if (stocks.length === 0) {
    return (
      <div className="p-6">
        <p className="text-destructive font-medium">
          No stock found for this product. Add stock first — the barcode is
          assigned when stock is created.
        </p>
      </div>
    );
  }

  return (
    <PrintLabelClient
      productId={product.id}
      productName={product.name}
      sellingPrice={Number(product.selling_price)}
      stocks={stocks.map((s) => ({
        barcode: String(s.barcode),
        colorName: s.colorName,
        sizeName: s.sizeName,
      }))}
    />
  );
}
