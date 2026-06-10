import { ContentLayout } from "@/components/admin-panel/content-layout";
import { fileUrlGenerator } from "@/utils/helpers";
import { getProducts } from "@/services/product";
import { ProductDataTable } from "./data-table";
import { getCategories } from "@/services/category";
import prisma from "@/db/prisma";

export const revalidate = 0;

export type ProductFilter = {
  filter_global?: string;
  filter?: string;
};

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function ProductListPage({ searchParams }: Props) {
  const { per_page, page } = searchParams;

  const limit = typeof per_page === "string" ? parseInt(per_page) : 20;
  const currentPage = typeof page === "string" ? parseInt(page) : 1;
  const skip = (currentPage - 1) * limit;

  const filter: ProductFilter = {
    filter_global: searchParams.filter_global as string,
    filter: searchParams.filter as string,
  };

  const data = await getProducts({
    where: filter,
    skip,
    take: limit,
  });

  const countResult = await prisma.products.aggregate({
    _count: { id: true }
  });

  const totals = Number(countResult._count.id);
  const pageCount = Math.ceil(totals / limit);

  const categories = await getCategories();

  return (
    <ContentLayout title="Product List">
      <ProductDataTable
        data={data.products.map((product: any) => ({
          ...product,
          imageUrl: product.imageUrl
            ? fileUrlGenerator(product.imageUrl)
            : "/images/default-product.png",
        }))}
        pageCount={pageCount}
        categories={categories}
        totalProduct={data.total}
      />
    </ContentLayout>
  );
}
