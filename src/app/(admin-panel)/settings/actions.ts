"use server";

import { processImage, saveImageBufferToFile } from "@/lib/sharp";
import {
  createPaymentMethods,
  deletePaymentMethod,
} from "@/services/payment-method";
import {
  createSettings,
  deleteSettings,
  getSettingById,
  updateSettings,
} from "@/services/settings";
import { filenameGenerator } from "@/utils/helpers";
import { revalidatePath } from "next/cache";

const getTrimmedValue = (formdata: FormData, key: string) => {
  const value = formdata.get(key);

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const toNullableNumber = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const hasMeaningfulValue = (values: Record<string, unknown>) =>
  Object.values(values).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== undefined && value !== null && value !== "";
  });

export async function SettingsFormAction(formdata: FormData) {
  try {
    const logoFile = formdata.getAll("logo_image")[0] as File | undefined;
    const loginImageFile = formdata.getAll("login_image")[0] as
      | File
      | undefined;

    const logoImageUrl = logoFile
      ? (() => {
          return filenameGenerator(logoFile.name, "logo", "/images/logo");
        })()
      : undefined;
    const loginImageUrl = loginImageFile
      ? (() => {
          return filenameGenerator(
            loginImageFile.name,
            "login",
            "/images/login",
          );
        })()
      : undefined;

    const inputData = {
      logo_image_url: logoImageUrl,
      login_image_url: loginImageUrl,
      return_privacy_policy: getTrimmedValue(formdata, "return_privacy_policy"),
      brand_name: getTrimmedValue(formdata, "brand_name"),
      vat_rate: toNullableNumber(formdata.get("vat_rate")),
    };

    if (!hasMeaningfulValue(inputData)) {
      return {
        success: false,
        message: "Add at least one setting before creating it.",
      };
    }

    if (logoFile && logoImageUrl) {
      const processedLogoFile = await processImage(logoFile);
      await saveImageBufferToFile(processedLogoFile, logoImageUrl);
    }

    if (loginImageFile && loginImageUrl) {
      const processedLoginFile = await processImage(loginImageFile);
      await saveImageBufferToFile(processedLoginFile, loginImageUrl);
    }

    const settings = await createSettings(inputData);

    revalidatePath("/settings");
    return {
      success: true,
      data: settings,
      message: "Settings created successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create settings.",
    };
  }
}

export async function updateSettingFormAction(id: number, formdata: FormData) {
  try {
    const currentSetting = await getSettingById(id);

    if (!currentSetting) {
      return { success: false, message: "Setting not found." };
    }

    const logoFile = formdata.getAll("logo_image")[0] as File | undefined;
    const loginImageFile = formdata.getAll("login_image")[0] as
      | File
      | undefined;

    let logo_image_url = currentSetting.logo_image_url;
    if (logoFile) {
      logo_image_url = filenameGenerator(logoFile.name, "logo", "/images/logo");
      const processedLogoFile = await processImage(logoFile);
      await saveImageBufferToFile(processedLogoFile, logo_image_url);
    }

    const inputData = {
      logo_image_url,
      login_image_url: currentSetting.login_image_url,
      return_privacy_policy: getTrimmedValue(formdata, "return_privacy_policy"),
      brand_name: getTrimmedValue(formdata, "brand_name"),
      vat_rate: toNullableNumber(formdata.get("vat_rate")),
    };

    if (loginImageFile) {
      const nextLoginImageUrl = filenameGenerator(
        loginImageFile.name,
        "login",
        "/images/login",
      );
      const processedLoginFile = await processImage(loginImageFile);
      await saveImageBufferToFile(processedLoginFile, nextLoginImageUrl);
      inputData.login_image_url = nextLoginImageUrl;
    }

    const hasChanges =
      inputData.logo_image_url !== currentSetting.logo_image_url ||
      inputData.login_image_url !== currentSetting.login_image_url ||
      inputData.return_privacy_policy !==
        currentSetting.return_privacy_policy ||
      inputData.brand_name !== currentSetting.brand_name ||
      (inputData.vat_rate ?? null) !== (currentSetting.vat_rate ?? null);

    if (!hasChanges) {
      return {
        success: true,
        data: currentSetting,
        message: "No changes to update.",
      };
    }

    const updatedSetting = await updateSettings(id, inputData);

    revalidatePath("/settings");
    return {
      success: true,
      data: updatedSetting,
      message: "Setting updated successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update setting.",
    };
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
