"use server";

import db from "@/db/database";
import { logger } from "@/lib/winston";
import { Settings } from "@/types/shared";

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
  const query = db("settings_data").select("*");

  const settings_data = await query;
  return settings_data;
}

export async function getSetting(): Promise<Settings> {
  const query = db("settings_data")
    .select("*")
    .orderBy("settings_data.id", "desc")
    .first();

  const setting = await query;
  return setting;
}

export async function updateSettings(id: number, data: Settings) {
  const insertedId = await db("settings_data").update(data).where({ id: id });
  const setting = await db("settings_data")
    .where({ id: insertedId })
    .select("*")
    .first();
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
      return { message: `Settings with id ${id} deleted successfully` };
    } catch (error) {
      logger.error("Failed to delete settings_data:", error);
      throw new Error("Failed to delete settings_data");
    }
  });
}
