"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { dropZoneConfig, productFormSchema } from "./form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { humanFileSize, makeFormData } from "@/utils/helpers";
import { createProductFormAction } from "./action";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { FileUp, Paperclip, SquarePlus } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-uploader";
import { FileSvgDraw } from "@/components/utils/file-draw";
import Image from "next/image";
import { AddCategoryModal } from "@/components/modals/add-category-modal";
import { AddBrandModal } from "@/components/modals/add-brand-modal";
import { AddColorModal } from "@/components/modals/add-color-modal";
import { AddSizeModal } from "@/components/modals/add-size-modal";
import { Brands, Categories, Colors, Sizes } from "@/types/shared";
import { Card } from "@/components/ui/card";
import { getCategories } from "@/services/category";
import { getColors } from "@/services/color";
import { getSizes } from "@/services/size";
import { getBrands } from "@/services/brand";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const defaultValues = {
  name: "",
  sku: "",
  sellingPrice: "",
  description: "",
  categoryId: "",
  brandId: "",
  files: [],
  colorIds: [],
  sizeIds: [],
};

export const AddProductForm: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const [openAddCat, setOpenAddCat] = React.useState(false);
  const [openAddBrand, setOpenAddBrand] = React.useState(false);
  const [openAddColor, setOpenAddColor] = React.useState(false);
  const [openAddSize, setOpenAddSize] = React.useState(false);
  const [brands, setBrands] = React.useState<Brands[]>([]);
  const [categories, setCategories] = React.useState<Categories[]>([]);
  const [colors, setColors] = React.useState<Colors[]>([]);
  const [sizes, setSizes] = React.useState<Sizes[]>([]);

  React.useEffect(() => {
    getCategories().then((data) => setCategories(data));

    getBrands().then((data) => setBrands(data));

    getColors().then((data) => setColors(data));

    getSizes().then((data) => setSizes(data));
  }, [openAddCat, openAddBrand, openAddColor, openAddSize]);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    setLoading(true);
    const formData = makeFormData(values);
    try {
      const result = await createProductFormAction(formData);
      if (result) {
        toast({
          title: "Product created successfully",
          description: `Product has been created successfully`,
          variant: "default",
        });
        form.reset();
      }
    } catch (error: any) {
      // console.error(error);
      toast({
        title: "Failed to create product",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col items-start justify-between gap-4 xl:flex-row"
        >
          <Card className="m-4 w-full rounded-lg p-4 xl:m-6 xl:mr-1 xl:w-4/6">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
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

            <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="colorIds"
                render={({ field }) => (
                  <MultiSelector
                    values={field.value}
                    onValuesChange={field.onChange}
                    realValues={colors}
                    className="col-span-1 grid grid-cols-1 gap-2 md:col-span-2 xl:col-span-3 xl:grid-cols-3"
                  >
                    <div className="col-span-1 flex items-end gap-2">
                      <div className="flex-1">
                        <FormLabel>Colors</FormLabel>
                        <MultiSelectorInput
                          className=" py-2 px-3 rounded-md mt-2 w-full"
                          placeholder="Type to search..."
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
                    <MultiSelectorTrigger className="col-span-1 mt-2 xl:col-span-2 xl:mt-8"></MultiSelectorTrigger>
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
                    className="col-span-1 grid grid-cols-1 gap-2 md:col-span-2 xl:col-span-3 xl:grid-cols-3"
                  >
                    <div className="col-span-1 flex items-end gap-2">
                      <div className="flex-1">
                        <FormLabel>Level / Sizes</FormLabel>
                        <MultiSelectorInput
                          className="py-2 px-3 rounded-md mt-2 w-full"
                          placeholder="Type to search..."
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
                    <MultiSelectorTrigger className="col-span-1 mt-2 xl:col-span-2 xl:mt-8"></MultiSelectorTrigger>
                  </MultiSelector>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
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

            <div className="flex justify-center items-center mt-6">
              <Button type="submit" variant="default" loading={loading}>
                <SquarePlus /> Add Product
              </Button>
            </div>
          </Card>

          <Card className="m-4 w-full rounded-lg p-4 xl:m-6 xl:ml-2 xl:w-2/6">
            <FormField
              control={form.control}
              name="files"
              rules={{ required: "Please upload at least one image." }}
              render={({ field }) => (
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2 border-dashed border-2"
                >
                  <FileUploaderContent className="flex justify-center items-center flex-row gap-2">
                    {field.value &&
                      field.value.length > 0 &&
                      field.value.map((file, i) => (
                        <FileUploaderItem
                          key={i}
                          index={i}
                          className="w-full h-full p-0 rounded-md overflow-hidden"
                        >
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            height={280}
                            width={280}
                            className="w-full object-cover p-0"
                          />
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                  <FileInput className="outline-dashed outline-1 outline-white">
                    <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                      <FileSvgDraw />
                    </div>
                  </FileInput>
                </FileUploader>
              )}
            />

            <div className="mt-4">
              {form.getValues("files") &&
                form.getValues("files").length > 0 &&
                form.getValues("files").map((file, i) => (
                  <div className="border-dashed border-2 rounded-lg p-2 px-3">
                    <div
                      key={i}
                      className="flex flex-col gap-2 text-xs text-gray-500 justify-center h-full"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 stroke-current" />
                        <span>{file.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileUp className="h-4 w-4 stroke-current" />
                        <span>{humanFileSize(file.size)}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="text-red-400 text-xs min-h-4">
              {form.formState.errors.files?.message}
            </div>
          </Card>
        </form>
      </Form>
      <AddCategoryModal open={openAddCat} onOpenChange={setOpenAddCat} />
      <AddBrandModal open={openAddBrand} onOpenChange={setOpenAddBrand} />
      <AddColorModal open={openAddColor} onOpenChange={setOpenAddColor} />
      <AddSizeModal open={openAddSize} onOpenChange={setOpenAddSize} />
    </>
  );
};
