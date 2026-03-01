"use server";

import db from "@/db/database";

export async function getBrands() {
  return await db("brands").orderBy("name", "asc");
}

export async function getBrand(params: { where: { id: number } }) {
  return await db("brands").where(params.where).first();
}

export async function createBrand(data: { name: string }) {
  return await db("brands").insert(data);
}

export async function updateBrand(params: {
  where: { id: number };
  data: { name?: string };
}) {
  return await db("brands").where(params.where).update(params.data);
}

export async function deleteBrand(params: { where: { id: number } }) {
  return await db("brands").where(params.where).del();
}
