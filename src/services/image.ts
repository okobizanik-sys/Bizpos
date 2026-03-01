"use server";

import db from "@/db/database";
import { logger } from "../lib/winston";

// Create a new image
export async function createImage(data: { url: string }) {
  const [insertResult] = await db("images").insert(data);
  const lastInsertId = insertResult;

  const [image] = await db("images").where({ id: lastInsertId });
  logger.info(`Image created successfully: ${image.id}`);
  return image;
}
