"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ImagePlus,
  MoreHorizontal,
  Printer,
  SquarePlus,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { FileInput, FileUploader } from "@/components/ui/file-uploader";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductAuxiliaryData } from "../add-product/hook";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { dropZoneConfig, productFormSchema } from "../add-product/form-schema";
import { deleteProductOnConfirmed, updateProductFormAction } from "./action";
import { makeFormData } from "@/utils/helpers";
import { useToast } from "@/components/ui/use-toast";
import { confirmation } from "@/components/modals/confirm-modal";
import db from "@/db/database";
import { ProductList } from "./columns";
import {
  Brands,
  Categories,
  Colors,
  ProductColors,
  ProductSizes,
  Sizes,
} from "@/types/shared";
import { getColors, getProductColors } from "@/services/color";
import { getProductSizes, getSizes } from "@/services/size";
import { AddCategoryModal } from "@/components/modals/add-category-modal";
import { AddBrandModal } from "@/components/modals/add-brand-modal";
import { AddColorModal } from "@/components/modals/add-color-modal";
import { AddSizeModal } from "@/components/modals/add-size-modal";
import { getCategories } from "@/services/category";
import { getBrands } from "@/services/brand";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Props {
  product: ProductList;
}

export function ProductDetailSheet({ product }: Props) {
  const [selectedImageUrl, setSelectedImageUrl] = useState(product.imageUrl);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [productColors, setProductColors] = useState<ProductColors[]>([]);
  const [productSizes, setProductSizes] = useState<ProductSizes[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddCat, setOpenAddCat] = useState(false);
  const [openAddBrand, setOpenAddBrand] = useState(false);
  const [openAddColor, setOpenAddColor] = useState(false);
  const [openAddSize, setOpenAddSize] = useState(false);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [brands, setBrands] = useState<Brands[]>([]);
  const [colors, setColors] = useState<Colors[]>([]);
  const [sizes, setSizes] = useState<Sizes[]>([]);
  const { toast } = useToast();

  const { fetchAll, isApiLoading } = useProductAuxiliaryData();

  useEffect(() => {
    getProductColors(Number(product.id)).then((data) => {
      setProductColors(data);
      form.setValue(
        "colorIds",
        data.map((color) => String(color.id)),
      );
    });

    getProductSizes(Number(product.id)).then((data) => {
      setProductSizes(data);
      form.setValue(
        "sizeIds",
        data.map((size) => String(size.id)),
      );
    });

    getCategories().then((data) => setCategories(data));
    getBrands().then((data) => setBrands(data));
    getSizes().then((data) => setSizes(data));
    getColors().then((data) => setColors(data));
  }, [product, openAddColor, openAddSize, openAddBrand, openAddCat]);

  const productUpdateFormSchema = productFormSchema.extend({
    files: z.array(z.instanceof(File)).max(1),
  });

  const form = useForm<z.infer<typeof productUpdateFormSchema>>({
    resolver: zodResolver(productUpdateFormSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      sellingPrice: String(product.selling_price),
      description: product.description || "",
      categoryId: String(product.category_id),
      brandId: String(product?.brand_id) || "",
      files: [],
      colorIds: productColors.map((color) => String(color.color_id)),
      sizeIds: productSizes.map((size) => String(size.size_id)),
    },
  });

  useEffect(() => {
    if (form.watch("files").length > 0) {
      const file = form.watch("files")[0];
      setSelectedImageUrl(URL.createObjectURL(file));
    } else {
      setSelectedImageUrl(product.imageUrl);
    }
  }, [form.watch("files")]);

  useEffect(() => {
    if (sheetOpen) fetchAll();
  }, [sheetOpen]);

  const onSubmitUpdate = async (
    values: z.infer<typeof productUpdateFormSchema>,
  ) => {
    setUpdating(true);
    const formData = makeFormData(values);

    try {
      await updateProductFormAction(Number(product.id), formData);
      toast({
        title: "Product updated successfully",
        description: `Product has been updated successfully`,
        variant: "default",
      });
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to update product",
        description: error.message,
        variant: "destructive",
      });
    }
    setUpdating(false);
  };

  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this product?")) {
      setDeleting(true);
      const deletedProduct = await deleteProductOnConfirmed(BigInt(product.id));
      if (deletedProduct) {
        toast({
          title: "Product deleted successfully",
          description: `Product has been deleted successfully`,
          variant: "default",
        });
        setSheetOpen(false);
      }
    }
    setDeleting(false);
  };

  return (
    <Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full overflow-y-auto sm:max-w-[750px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Product Details</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitUpdate)} className="my-4">
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>
                      Product Name <b className="text-red-500">*</b>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.name?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className="w-full h-full">
                {selectedImageUrl ? (
                  <Image
                    src={selectedImageUrl}
                    alt={product.name}
                    height={350}
                    width={350}
                    className="w-full aspect-square object-cover rounded-md"
                  />
                ) : (
                  <p>No Image</p>
                )}

                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      dropzoneOptions={dropZoneConfig}
                      reSelect={true}
                    >
                      <FileInput
                        className={cn(
                          buttonVariants({
                            size: "icon",
                            variant: "ghost",
                          }),
                          "size-8",
                        )}
                      >
                        <ImagePlus className="size-4" />
                      </FileInput>
                      {field.value && field.value.length > 0 && (
                        <Button
                          variant="ghost"
                          className="ml-1 h-6 w-6 p-0"
                          onClick={() => form.setValue("files", [])}
                        >
                          <TrashIcon className="size-4 text-red-500 hover:text-red-800" />
                        </Button>
                      )}
                    </FileUploader>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <div className="flex items-end gap-2 w-full">
                    <FormItem className="flex-1">
                      <FormLabel>
                        Category <b className="text-red-500">*</b>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isApiLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={String(category.id)}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription className="text-red-400 text-xs min-h-4">
                        {form.formState.errors.categoryId?.message}
                      </FormDescription>
                    </FormItem>
                    <Button
                      type="button"
                      onClick={() => setOpenAddCat(true)}
                      variant="default"
                      size="icon"
                      className="mb-6"
                    >
                      <SquarePlus />
                    </Button>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <div className="flex items-end gap-2 w-full">
                    <FormItem className="flex-1">
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isApiLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((brand) => (
                              <SelectItem
                                key={brand.id}
                                value={String(brand.id)}
                              >
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription className="text-red-400 text-xs min-h-4">
                        {form.formState.errors.brandId?.message}
                      </FormDescription>
                    </FormItem>
                    <Button
                      type="button"
                      onClick={() => setOpenAddBrand(true)}
                      variant="default"
                      size="icon"
                      className="mb-6"
                    >
                      <SquarePlus />
                    </Button>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      SKU <b className="text-red-500">*</b>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SKU" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.sku?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Selling Price <b className="text-red-500">*</b>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter selling price"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.sellingPrice?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="colorIds"
              render={({ field }) => (
                <MultiSelector
                  values={field.value}
                  onValuesChange={field.onChange}
                  realValues={colors}
                  className="col-span-1 grid grid-cols-1 gap-2 lg:col-span-2 lg:grid-cols-3"
                >
                  <div className="col-span-1 flex gap-2 items-end">
                    <div className="flex-1">
                      <FormLabel>Colors</FormLabel>
                      <MultiSelectorInput
                        className=" py-2 px-3 rounded-md mt-2 w-full"
                        placeholder="Type to search..."
                        disabled={isApiLoading}
                      />

                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {colors.map((color) => (
                            <MultiSelectorItem
                              key={color.id}
                              value={String(color.id)}
                            >
                              {color.name}
                            </MultiSelectorItem>
                          ))}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </div>
                    <Button
                      variant="default"
                      type="button"
                      size="icon"
                      onClick={() => setOpenAddColor(true)}
                    >
                      <SquarePlus />
                    </Button>
                  </div>
                  {colors && !isApiLoading && (
                    <MultiSelectorTrigger className="col-span-1 mt-2 lg:col-span-2 lg:mt-8"></MultiSelectorTrigger>
                  )}
                </MultiSelector>
              )}
            />

            <FormField
              control={form.control}
              name="sizeIds"
              render={({ field }) => (
                <MultiSelector
                  values={field.value}
                  onValuesChange={field.onChange}
                  realValues={sizes}
                  className="col-span-1 grid grid-cols-1 gap-2 lg:col-span-2 lg:grid-cols-3"
                >
                  <div className="col-span-1 flex items-end gap-2">
                    <div className="flex-1">
                      <FormLabel>Levels / Sizes</FormLabel>
                      <MultiSelectorInput
                        className=" py-2 px-3 rounded-md mt-2 w-full"
                        placeholder="Type to search..."
                        disabled={isApiLoading}
                      />
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {sizes.map((size) => (
                            <MultiSelectorItem
                              key={size.id}
                              value={String(size.id)}
                            >
                              {size.name}
                            </MultiSelectorItem>
                          ))}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </div>
                    <Button
                      variant="default"
                      type="button"
                      size="icon"
                      onClick={() => setOpenAddSize(true)}
                    >
                      <SquarePlus />
                    </Button>
                  </div>
                  {sizes && !isApiLoading && (
                    <MultiSelectorTrigger className="col-span-1 mt-2 lg:col-span-2 lg:mt-8"></MultiSelectorTrigger>
                  )}
                </MultiSelector>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="Enter description" {...field} /> */}
                    <ReactQuill {...field} />
                  </FormControl>
                  <FormDescription className="text-red-400 text-xs min-h-4">
                    {form.formState.errors.description?.message}
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="m-4 flex gap-2">
              <Button
                type="submit"
                variant="default"
                loading={updating}
                disabled={isApiLoading}
              >
                Update
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteClick}
                loading={deleting}
                disabled={isApiLoading}
              >
                Delete
              </Button>
              <Link href={`/inventories/products/${product.id}/print-label`}>
                <Button type="button" variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Label
                </Button>
              </Link>
            </div>
          </form>
        </Form>

        <AddCategoryModal open={openAddCat} onOpenChange={setOpenAddCat} />
        <AddBrandModal open={openAddBrand} onOpenChange={setOpenAddBrand} />
        <AddColorModal open={openAddColor} onOpenChange={setOpenAddColor} />
        <AddSizeModal open={openAddSize} onOpenChange={setOpenAddSize} />
      </SheetContent>
    </Sheet>
  );
}
