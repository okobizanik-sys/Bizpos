"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ImagePlus, MoreHorizontal, SquarePlus, TrashIcon } from "lucide-react";
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
import { fileUrlGenerator, makeFormData } from "@/utils/helpers";
import { useToast } from "@/components/ui/use-toast";
import { confirmation } from "@/components/modals/confirm-modal";
import { Settings } from "@/types/shared";
import { dropZoneConfig, settingsFormSchema } from "./form-schema";
import { deleteSettingOnConfirmed, updateSettingFormAction } from "./actions";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Props {
  setting: Settings;
}

export function SettingDetailSheet({ setting }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(
    fileUrlGenerator(setting.logo_image_url || "")
  );
  const [selectedLoginImage, setSelectedLoginImage] = useState(
    fileUrlGenerator(setting.login_image_url || "")
  );
  const { toast } = useToast();

  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      return_privacy_policy: setting?.return_privacy_policy,
      vat_rate: String(setting?.vat_rate),
      logo_image: [],
      login_image: [],
      // logo_image: setting?.logo_image_url ? [setting?.logo_image_url] : [],
      // login_image: setting?.login_image_url ? [setting?.login_image_url] : [],
    },
  });

  useEffect(() => {
    if (form.watch("logo_image").length > 0) {
      const file = form.watch("logo_image")[0];
      setSelectedLogo(URL.createObjectURL(file));
    } else {
      setSelectedLogo(fileUrlGenerator(setting.logo_image_url || ""));
    }
  }, [form.watch("logo_image")]);

  useEffect(() => {
    if (form.watch("login_image").length > 0) {
      const file = form.watch("login_image")[0];
      setSelectedLoginImage(URL.createObjectURL(file));
    } else {
      setSelectedLoginImage(fileUrlGenerator(setting.login_image_url || ""));
    }
  }, [form.watch("login_image")]);

  const onSubmit = async (values: z.infer<typeof settingsFormSchema>) => {
    // console.log("Form submitted:", values);
    setUpdating(true);
    const formData = makeFormData(values);
    // console.log(values, "values from update form");
    // console.log(formData, "formData from update form");
    try {
      await updateSettingFormAction(Number(setting.id), formData);
      toast({
        title: "Setting updated successfully",
        description: `Setting has been updated successfully`,
        variant: "default",
      });
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to update setting",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
      window.location.reload();
    }
  };

  // const testValues = {
  //   return_privacy_policy: "Test policy",
  //   vat_rate: "5",
  //   logo_image: [],
  //   login_image: [],
  // };
  // onSubmit(testValues);

  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this setting?")) {
      setDeleting(true);
      const deletedSetting = await deleteSettingOnConfirmed(Number(setting.id));
      if (deletedSetting) {
        toast({
          title: "Setting deleted successfully",
          description: `Setting has been deleted successfully`,
          variant: "default",
        });
        setSheetOpen(false);
      }
    }
    setDeleting(false);
    window.location.reload();
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
          <SheetTitle>Setting Details</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2">
              {/* Login image upload */}
              <div className="w-full h-full">
                <Label>
                  Login Page Image (1600px * 80px){" "}
                  <b className="text-red-500">*</b>
                </Label>
                {selectedLoginImage ? (
                  <Image
                    src={selectedLoginImage}
                    // src={fileUrlGenerator(selectedLoginImage)}
                    alt={selectedLoginImage}
                    height={350}
                    width={350}
                    className="w-full object-cover rounded-md"
                  />
                ) : (
                  <p>No Image</p>
                )}
                <FormField
                  control={form.control}
                  name="login_image"
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
                          "size-8"
                        )}
                      >
                        <ImagePlus className="size-4" />
                      </FileInput>
                      {field.value && field.value.length > 0 && (
                        <Button
                          variant="ghost"
                          className="ml-1 h-6 w-6 p-0"
                          onClick={() => form.setValue("login_image", [])}
                        >
                          <TrashIcon className="size-4 text-red-500 hover:text-red-800" />
                        </Button>
                      )}
                    </FileUploader>
                  )}
                />
              </div>

              {/* Logo upload */}
              <div className="w-full h-full">
                <Label>
                  Logo Upload (150px * 40px) <b className="text-red-500">*</b>
                </Label>
                {selectedLogo ? (
                  <Image
                    src={selectedLogo}
                    // src={fileUrlGenerator(selectedLogo)}
                    alt={selectedLogo}
                    height={350}
                    width={350}
                    className="w-full object-cover rounded-md"
                  />
                ) : (
                  <p>No Image</p>
                )}
                <FormField
                  control={form.control}
                  name="logo_image"
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
                          "size-8"
                        )}
                      >
                        <ImagePlus className="size-4" />
                      </FileInput>
                      {field.value && field.value.length > 0 && (
                        <Button
                          variant="ghost"
                          className="ml-1 h-6 w-6 p-0"
                          onClick={() => form.setValue("logo_image", [])}
                        >
                          <TrashIcon className="size-4 text-red-500 hover:text-red-800" />
                        </Button>
                      )}
                    </FileUploader>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
              <FormField
                control={form.control}
                name="return_privacy_policy"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Return Policy</FormLabel>
                    <FormControl>
                      {/* <Textarea
                        placeholder="Enter settings return & exchange policy"
                        {...field}
                      /> */}
                      <ReactQuill {...field} />
                      {/* <Input
                        placeholder="Enter settings return & exchange policy"
                        {...field}
                      /> */}
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.return_privacy_policy?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vat_rate"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>VAT Rate</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter vat rate" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.vat_rate?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button type="submit" variant="default" loading={updating}>
                Update
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteClick}
                loading={deleting}
              >
                Delete
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
