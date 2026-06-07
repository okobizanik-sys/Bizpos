import { notFound } from "next/navigation";
import prisma from "@/db/prisma";
import PrintLabelClient from "./print-label-client";

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

  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || "";

  const product = await prisma.products.findUnique({
    where: { id: BigInt(productId) },
    select: { id: true, name: true, selling_price: true }
  });

  if (!product) {
    notFound();
  }

  const stocks = await prisma.$queryRawUnsafe<any[]>(`
    SELECT stocks.barcode, COALESCE(colors.name, '-') as colorName, COALESCE(sizes.name, '-') as sizeName
    FROM stocks
    LEFT JOIN colors ON stocks.color_id = colors.id
    LEFT JOIN sizes ON stocks.size_id = sizes.id
    WHERE stocks.product_id = ? AND stocks.condition = 'new'
    GROUP BY stocks.barcode, colors.name, sizes.name
  `, BigInt(productId));

  if (stocks.length === 0) {
    return (
      <div className="p-6">
        <p className="text-destructive font-medium">
          No stock found for this product. Add stock first, then print the
          label.
        </p>
      </div>
    );
  }

  return (
    <PrintLabelClient
      productId={Number(product.id)}
      logoUrl={logoUrl}
      productName={product.name as string}
      sellingPrice={Number(product.selling_price)}
      stocks={stocks.map((s) => ({
        barcode: String(s.barcode),
        colorName: s.colorName,
        sizeName: s.sizeName,
      }))}
    />
  );
}
