"use server";

import db from "@/db/database";
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
    message.includes("Knex: Timeout acquiring a connection") ||
    message.includes("KnexTimeoutError")
  );
};

export async function createSettings(data: Settings) {
  return await db.transaction(async (trx) => {
    try {
      const existingSetting = await trx("settings_data").select("*").first();

      if (existingSetting) {
        await trx("settings_data").del();
        logger.info("Existing settings found and deleted.");
      }

      const [insertResult] = await trx("settings_data").insert(data);

      const setting = await trx("settings_data")
        .where({ id: insertResult })
        .select("*")
        .first();

      logger.info(`Settings created successfully: ${setting.id}`);
      return setting;
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
    const settingsData = await db("settings_data").select("*").timeout(4000);
    cachedSettingsList = settingsData;
    cachedSetting = settingsData.at(-1) || EMPTY_SETTINGS;
    lastSettingsReadAt = Date.now();
    return settingsData;
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
    const setting =
      (await db("settings_data")
        .select("*")
        .orderBy("settings_data.id", "desc")
        .first()
        .timeout(4000)) || EMPTY_SETTINGS;

    cachedSetting = setting;
    cachedSettingsList = setting?.id ? [setting] : cachedSettingsList;
    lastSettingsReadAt = Date.now();
    return setting;
  } catch (error) {
    logger.error("Failed to read latest settings_data:", error);

    if (isConnectionError(error)) {
      return cachedSetting;
    }

    return EMPTY_SETTINGS;
  }
}

export async function updateSettings(id: number, data: Settings) {
  await db("settings_data").update(data).where({ id: id });
  const setting = await db("settings_data")
    .where({ id })
    .select("*")
    .first();

  cachedSetting = setting || EMPTY_SETTINGS;
  cachedSettingsList = setting ? [setting] : EMPTY_SETTINGS_LIST;
  lastSettingsReadAt = Date.now();
  return setting;
}

export async function deleteSettings(id: number) {
  return await db.transaction(async (trx) => {
    try {
      const deletedCount = await trx("settings_data").where({ id }).del();

      if (deletedCount === 0) {
        throw new Error(`No setting found with id: ${id}`);
      }

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
