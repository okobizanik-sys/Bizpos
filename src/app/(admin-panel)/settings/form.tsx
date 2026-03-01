"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { humanFileSize, makeFormData } from "@/utils/helpers";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dropZoneConfig, settingsFormSchema } from "./form-schema";
import { SettingsFormAction } from "./actions";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-uploader";
import Image from "next/image";
import { FileSvgDraw } from "@/components/utils/file-draw";
import {
  FileUp,
  ImagePlus,
  MoreHorizontal,
  Paperclip,
  TrashIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Settings } from "@/types/shared";
import { cn } from "@/lib/utils";
import { getSetting, getSettings } from "@/services/settings";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Props {
  sheetOpen: boolean;
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SettingsForm: React.FC<Props> = ({ sheetOpen, setSheetOpen }) => {
  const [loading, setLoading] = React.useState(false);
  const [settings, setSettings] = React.useState<Settings>({});
  const [selectedLogo, setSelectedLogo] = React.useState<string>("");
  const [selectedLoginImage, setSelectedLoginImage] =
    React.useState<string>("");
  const { toast } = useToast();

  React.useEffect(() => {
    getSetting().then((data) => setSettings(data));
  }, [loading]);

  // console.log(settings);

  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      return_privacy_policy: "",
      vat_rate: "",
      logo_image: [],
      login_image: [],
    },
  });

  React.useEffect(() => {
    const logoFile = form.watch("logo_image")[0];
    if (logoFile) {
      const logoUrl = URL.createObjectURL(logoFile);
      setSelectedLogo(logoUrl);

      // Cleanup URL after file is cleared or component unmounts
      return () => URL.revokeObjectURL(logoUrl);
    }
  }, [form.watch("logo_image")]);

  React.useEffect(() => {
    const loginImageFile = form.watch("login_image")[0];
    if (loginImageFile) {
      const loginImageUrl = URL.createObjectURL(loginImageFile);
      setSelectedLoginImage(loginImageUrl);

      // Cleanup URL after file is cleared or component unmounts
      return () => URL.revokeObjectURL(loginImageUrl);
    }
  }, [form.watch("login_image")]);

  const onSubmit = async (values: z.infer<typeof settingsFormSchema>) => {
    setLoading(true);
    const formData = makeFormData(values);
    // console.log(formData, "from form");
    // console.log(values, "values from form");
    try {
      const result = await SettingsFormAction(formData);
      if (result.success) {
        toast({
          title: "Settings created successfully",
          description: `Settings has been created successfully`,
          variant: "default",
        });
        form.reset();
        setSelectedLoginImage("");
        setSelectedLogo("");
        setSheetOpen((prev) => !prev);
      }
    } catch (error: any) {
      // console.error(error);
      toast({
        title: "Failed to create settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          {/* <MoreHorizontal className="h-4 w-4" /> */}
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full overflow-y-auto sm:max-w-[750px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Settings Form</SheetTitle>
          <SheetClose />
        </SheetHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-4 grid grid-cols-1 items-center gap-2 md:grid-cols-2">
                {/* Login image upload */}
                <div className="w-full h-full">
                  <Label>
                    Login Page Image (1600px * 800px){" "}
                    <b className="text-red-500">*</b>
                  </Label>
                  {selectedLoginImage && (
                    <Image
                      src={selectedLoginImage}
                      alt={selectedLoginImage}
                      height={350}
                      width={350}
                      className="w-full object-cover rounded-md"
                    />
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
                  {selectedLogo && (
                    <Image
                      src={selectedLogo}
                      alt={selectedLogo}
                      height={350}
                      width={350}
                      className="w-full object-cover rounded-md"
                    />
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
                        {/* <Input
                          placeholder="Enter settings return & exchange policy"
                          {...field}
                        /> */}
                        <ReactQuill {...field} />
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
                <Button type="submit" variant="default" loading={loading}>
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
