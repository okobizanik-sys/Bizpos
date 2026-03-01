"use server";

import { processImage, saveImageBufferToFile } from "@/lib/sharp";
import {
  createPaymentMethods,
  deletePaymentMethod,
} from "@/services/payment-method";
import { createSettings, deleteSettings, updateSettings } from "@/services/settings";
import { filenameGenerator } from "@/utils/helpers";
import { revalidatePath } from "next/cache";

export async function SettingsFormAction(formdata: FormData) {
  try {
    const settingsData = {
      logo: formdata.getAll("logo_image") as File[],
      login_image: formdata.getAll("login_image") as File[],
    };

    const processedLogoFile = await processImage(settingsData.logo[0]);
    const logofilename = filenameGenerator(
      settingsData.logo[0].name,
      "logo",
      "/images/logo"
    );
    await saveImageBufferToFile(processedLogoFile, logofilename);

    const logo_image_url = logofilename;

    const processedLoginFile = await processImage(settingsData.login_image[0]);
    const loginfilename = filenameGenerator(
      settingsData.login_image[0].name,
      "login",
      "/images/login"
    );
    await saveImageBufferToFile(processedLoginFile, loginfilename);

    const login_image_url = loginfilename;

    const inputData = {
      logo_image_url: logo_image_url,
      login_image_url: login_image_url,
      return_privacy_policy: formdata.get("return_privacy_policy") as string,
      vat_rate: Number(formdata.get("vat_rate")),
    };

    const settings = await createSettings(inputData);

    revalidatePath("/settings");
    return { success: true, data: settings };
  } catch (error: any) {
    return { success: false, data: error.message };
  }
}

export async function updateSettingFormAction(id: number, formdata: FormData) {
  try {
    const settingsData = {
      logo: formdata.getAll("logo_image") as File[],
      login_image: formdata.getAll("login_image") as File[],
    };

    let logo_image_url = "";
    if (settingsData.logo.length > 0) {
      const processedLogoFile = await processImage(settingsData.logo[0]);
      const logofilename = filenameGenerator(
        settingsData.logo[0].name,
        "logo",
        "/images/logo"
      );
      await saveImageBufferToFile(processedLogoFile, logofilename);
      logo_image_url = logofilename;
    }

    let login_image_url = "";
    if (settingsData.login_image.length > 0) {
      const processedLoginFile = await processImage(
        settingsData.login_image[0]
      );
      const loginfilename = filenameGenerator(
        settingsData.login_image[0].name,
        "login",
        "/images/login"
      );
      await saveImageBufferToFile(processedLoginFile, loginfilename);
      login_image_url = loginfilename;
    }

    const inputData = {
      logo_image_url:
        logo_image_url || (formdata.get("logo_image_url") as string),
      login_image_url:
        login_image_url || (formdata.get("login_image_url") as string),
      return_privacy_policy: formdata.get("return_privacy_policy") as string,
      vat_rate: Number(formdata.get("vat_rate")),
    };

    const updatedSetting = await updateSettings(id, inputData);

    revalidatePath("/settings");
    return { success: true, data: updatedSetting };
  } catch (error: any) {
    return { success: false, data: error.message };
  }
}

export async function deleteSettingOnConfirmed(id: number) {
  try {
    const deleteResult = await deleteSettings(id);

    revalidatePath("/settings");
    return { success: true, data: deleteResult };
  } catch (error: any) {
    return { success: false, data: error.message };
  }
}

export async function PaymentMethodsFormAction(formData: FormData) {
  try {
    const paymentMethodData = {
      name: formData.get("name") as string,
    };

    const paymentMethod = await createPaymentMethods(paymentMethodData);

    revalidatePath("/settings");
    return { success: true, data: paymentMethod };
  } catch (error: any) {
    return { success: false, data: error.message };
  }
}

export async function DeletePaymentMethod(id: number) {
  try {
    const deleteResult = await deletePaymentMethod({ where: { id } });
    revalidatePath("/settings");
    return { success: true, data: deleteResult };
  } catch (error: any) {
    return { success: false, data: error.message };
  }
}
