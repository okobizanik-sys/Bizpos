import { ContentLayout } from "@/components/admin-panel/content-layout";
import { columns } from "./columns";
import { fileUrlGenerator } from "@/utils/helpers";
import { getProducts } from "@/services/product";
import { ProductDataTable } from "./data-table";
import { getCategories } from "@/services/category";
import db from "@/db/database";

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
  const skip = (currentPage - 1) * limit; // Calculate the offset

  const filter: ProductFilter = {
    filter_global: searchParams.filter_global as string,
    filter: searchParams.filter as string,
  };

  const data = await getProducts({
    where: filter,
    skip, // Add this
    take: limit, // Add this
  });

  const [result] = await db("products").count("* as total");
  const totals = Number(result.total);
  const pageCount = Math.ceil(totals / limit);

  const categories = await getCategories();
  console.log(data, "data from products");

  return (
    <ContentLayout title="Product List">
      <ProductDataTable
        columns={columns}
        data={data.products.map((product) => ({
          ...product,
          imageUrl: product.imageUrl
            ? fileUrlGenerator(product.imageUrl) // existing image
            : "/images/default-product.png", // fallback image
        }))}
        pageCount={pageCount}
        categories={categories}
        totalProduct={data.total}
      />
    </ContentLayout>
  );
}
