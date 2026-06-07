"use server";

import prisma from "@/db/prisma";
import { logger } from "../lib/winston";

export async function createImage(data: { url: string }) {
  const image = await prisma.images.create({ data });
  logger.info(`Image created successfully: ${image.id}`);
  return image;
}
