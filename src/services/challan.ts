"use server";

import { CreateChallanInput } from "@/app/(admin-panel)/stock-transfer/transfer-products/action";
import db from "@/db/database";
import { ChallanItem } from "@/types/shared";

// Create a new challan
export async function createChallan(data: CreateChallanInput) {
  const [insertedData] = await db("challans").insert(data);
  const lastInsertedId = insertedData;

  const [challan] = await db("challans").where({ id: lastInsertedId });
  return challan;
}

export async function createChallanItem(data: ChallanItem[]) {
  const insertedData = await db("challan_items").insert(data).returning("id");

  const challan_items = await db("challan_items").whereIn("id", insertedData);
  return challan_items;
}

export async function getChallan(params: { where: { id: bigint } }) {
  const challan = await db("challans").where(params.where).first();
  if (!challan) {
    throw new Error("Challan not found");
  }
  return challan;
}

export async function getChallanItems(params: {
  where: { challan_id: bigint };
  trx?: any;
}) {
  const dbs = db || params.trx;
  const challanItems = await dbs("challan_items")
    .leftJoin("challans", "challan_items.challan_id", "challans.id")
    .leftJoin("products", "challan_items.product_id", "products.id")
    .leftJoin("categories", "products.category_id", "categories.id")
    .select(
      "challan_items.*",
      "challans.id as challanId",
      "challans.from_branch_id",
      "challans.to_branch_id",
      "challans.status",
      "challans.challan_no",
      "products.name",
      "products.sku",
      "products.selling_price",
      "products.description",
      "products.category_id",
      "products.brand_id",
      "products.image_id",
      "categories.name as categoryName"
    )
    .where(params.where);

  return challanItems;
}

export async function getChallans(params: { where?: { [key: string]: any } }) {
  const { challan_no, status, created_at } = params.where || {};

  const query = db("challans")
    .leftJoin(
      "branches as fromBranch",
      "challans.from_branch_id",
      "fromBranch.id"
    )
    .leftJoin("branches as toBranch", "challans.to_branch_id", "toBranch.id")
    .select(
      "challans.*",
      "fromBranch.name as from_branch_name",
      "toBranch.name as to_branch_name"
    )
    .orderBy("challans.id", "desc");

  if (challan_no) {
    query.andWhere("challans.challan_no", challan_no);
  }

  if (status) {
    query.andWhere("challans.status", status);
  }

  if (created_at) {
    query.whereBetween("challans.updated_at", [created_at.gte, created_at.lte]);
  }

  const challans = await query;
  return challans;
}

// Delete a challan by unique identifier
export async function deleteChallan(params: {
  where: { id: number }; // Adjust the unique field as necessary
}) {
  const deletedCount = await db("challans").where(params.where).del();
  if (deletedCount === 0) {
    throw new Error("Challan not found");
  }
  return { message: "Challan deleted successfully" };
}

export async function updateChallanStatus(challanId: bigint, trx?: any) {
  const dbs = db || trx;
  return await dbs("challans").where({ id: challanId }).update({
    status: "RECEIVED",
    updated_at: new Date(),
  });
}
