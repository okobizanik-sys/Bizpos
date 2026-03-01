import { Navbar } from "@/components/admin-panel/navbar";
import { getBrands } from "@/services/brand";
import { getCategories } from "@/services/category";
import { getColors } from "@/services/color";
import { getSizes } from "@/services/size";
import { CardCategory } from "./card-category";
import { CardBrand } from "./card-brand";
import { CardColor } from "./card-color";
import { CardSize } from "./card-size";
import { EditModal } from "./edit-modal";

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export type VariantType = "category" | "color" | "size" | "brand";

export default async function VariantsPage({ searchParams }: Props) {
  const { id, type, name } = searchParams;
  const showModal = Boolean(id && type);

  const categories = await getCategories();
  const brands = await getBrands();
  const colors = await getColors();
  const sizes = await getSizes();

  return (
    <div>
      <Navbar title="Variants" />
      <div className="m-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CardCategory data={categories} />
        <CardBrand data={brands} />
        <CardColor data={colors} />
        <CardSize data={sizes} />
      </div>
      {showModal && (
        <EditModal
          open={showModal}
          id={id as string}
          name={name as string}
          type={type as VariantType}
        />
      )}
    </div>
  );
}
