"use server";

import prisma from "@/db/prisma";
import { logger } from "@/lib/winston";
import { Settings } from "@/types/shared";

const EMPTY_SETTINGS: Settings = {};
const EMPTY_SETTINGS_LIST: Settings[] = [];
const SETTINGS_CACHE_TTL_MS = 15000;

let cachedSetting: Settings = EMPTY_SETTINGS;
let cachedSettingsList: Settings[] = EMPTY_SETTINGS_LIST;
let lastSettingsReadAt = 0;

const isSettingsCacheFresh = () =>
  Date.now() - lastSettingsReadAt < SETTINGS_CACHE_TTL_MS;

const isConnectionError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("ETIMEDOUT") ||
    message.includes("ECONNREFUSED") ||
    message.includes("PrismaClientInitializationError") ||
    message.includes("PrismaClientKnownRequestError")
  );
};

const normalizeSettingsData = (data: Partial<Settings>) => {
  const normalized: Partial<Settings> = {};

  if (typeof data.return_privacy_policy === "string") {
    const value = data.return_privacy_policy.trim();
    if (value) normalized.return_privacy_policy = value;
  }

  if (typeof data.brand_name === "string") {
    const value = data.brand_name.trim();
    if (value) normalized.brand_name = value;
  }

  if (typeof data.logo_image_url === "string") {
    const value = data.logo_image_url.trim();
    if (value) normalized.logo_image_url = value;
  }

  if (typeof data.login_image_url === "string") {
    const value = data.login_image_url.trim();
    if (value) normalized.login_image_url = value;
  }

  if (data.vat_rate !== undefined && data.vat_rate !== null) {
    const value = Number(data.vat_rate);
    if (!Number.isNaN(value)) normalized.vat_rate = value;
  }

  return normalized;
};

export async function createSettings(data: Partial<Settings>) {
  return await prisma.$transaction(async (tx) => {
    try {
      const existingSetting = await tx.settings_data.findFirst();

      if (existingSetting) {
        await tx.settings_data.deleteMany();
        logger.info("Existing settings found and deleted.");
      }

      const setting = await tx.settings_data.create({
        data: normalizeSettingsData(data) as any,
      });
      logger.info(`Settings created successfully: ${setting.id}`);
      return setting as unknown as Settings;
    } catch (error) {
      logger.error("Failed to create settings_data:", error);
      throw new Error("Failed to create settings_data");
    }
  });
}

export async function getSettings(): Promise<Settings[]> {
  if (isSettingsCacheFresh()) {
    return cachedSettingsList;
  }

  try {
    const settingsData = await prisma.settings_data.findMany();
    cachedSettingsList = settingsData as unknown as Settings[];
    cachedSetting =
      (settingsData.at(-1) as unknown as Settings) || EMPTY_SETTINGS;
    lastSettingsReadAt = Date.now();
    return cachedSettingsList;
  } catch (error) {
    logger.error("Failed to read settings_data list:", error);

    if (isConnectionError(error)) {
      return cachedSettingsList;
    }

    return EMPTY_SETTINGS_LIST;
  }
}

export async function getSetting(): Promise<Settings> {
  if (isSettingsCacheFresh()) {
    return cachedSetting;
  }

  try {
    const setting = await prisma.settings_data.findFirst({
      orderBy: { id: "desc" },
    });

    cachedSetting = (setting as unknown as Settings) || EMPTY_SETTINGS;
    cachedSettingsList = setting
      ? [setting as unknown as Settings]
      : cachedSettingsList;
    lastSettingsReadAt = Date.now();
    return cachedSetting;
  } catch (error) {
    logger.error("Failed to read latest settings_data:", error);

    if (isConnectionError(error)) {
      return cachedSetting;
    }

    return EMPTY_SETTINGS;
  }
}

export async function getSettingById(id: number): Promise<Settings | null> {
  try {
    const setting = await prisma.settings_data.findUnique({ where: { id } });
    return (setting as unknown as Settings) || null;
  } catch (error) {
    logger.error(`Failed to read settings_data with id ${id}:`, error);
    return null;
  }
}

export async function updateSettings(id: number, data: Partial<Settings>) {
  const normalizedData = normalizeSettingsData(data);

  if (Object.keys(normalizedData).length === 0) {
    const currentSetting = await getSettingById(id);
    return currentSetting as Settings;
  }

  const setting = await prisma.settings_data.update({
    where: { id },
    data: normalizedData as any,
  });

  cachedSetting = (setting as unknown as Settings) || EMPTY_SETTINGS;
  cachedSettingsList = setting
    ? [setting as unknown as Settings]
    : EMPTY_SETTINGS_LIST;
  lastSettingsReadAt = Date.now();
  return setting as unknown as Settings;
}

export async function deleteSettings(id: number) {
  return await prisma.$transaction(async (tx) => {
    try {
      await tx.settings_data.delete({ where: { id } });

      logger.info(`Settings with id ${id} deleted successfully`);
      cachedSetting = EMPTY_SETTINGS;
      cachedSettingsList = EMPTY_SETTINGS_LIST;
      lastSettingsReadAt = Date.now();
      return { message: `Settings with id ${id} deleted successfully` };
    } catch (error) {
      logger.error("Failed to delete settings_data:", error);
      throw new Error("Failed to delete settings_data");
    }
  });
}
