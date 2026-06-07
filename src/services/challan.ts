"use server";

import { CreateChallanInput } from "@/app/(admin-panel)/stock-transfer/transfer-products/action";
import prisma from "@/db/prisma";
import { ChallanGetPayload, ChallanItem, ChallanItems, Challans } from "@/types/shared";

export async function createChallan(data: CreateChallanInput) {
  const challan = await prisma.challans.create({ data: data as any });
  return challan;
}

export async function createChallanItem(data: ChallanItem[]) {
  // Prisma doesn't return created IDs natively on createMany.
  // Using transaction to create one by one to get them back.
  const createdItems = await prisma.$transaction(
    data.map(item => prisma.challan_items.create({ data: item as any }))
  );

  return createdItems;
}

export async function getChallan(params: { where: { id: bigint } }) {
  const challan = await prisma.challans.findFirst({ where: params.where });
  if (!challan) {
    throw new Error("Challan not found");
  }
  return challan;
}

export async function getChallanItems(params: {
  where: { challan_id: bigint };
  tx?: any;
}): Promise<ChallanItems[]> {
  const dbs = params.tx || prisma;
  
  const query = `
    SELECT 
      ci.*,
      c.id as challanId,
      c.from_branch_id,
      c.to_branch_id,
      c.status,
      c.challan_no,
      p.name,
      p.sku,
      p.selling_price,
      p.description,
      p.category_id,
      p.brand_id,
      p.image_id,
      cat.name as categoryName
    FROM challan_items ci
    LEFT JOIN challans c ON ci.challan_id = c.id
    LEFT JOIN products p ON ci.product_id = p.id
    LEFT JOIN categories cat ON p.category_id = cat.id
    WHERE ci.challan_id = ?
  `;

  const challanItems = (await dbs.$queryRawUnsafe(
    query,
    params.where.challan_id
  )) as ChallanItems[];
  return challanItems;
}

export async function getChallans(params: {
  where?: { [key: string]: any };
}): Promise<Array<Challans & ChallanGetPayload>> {
  const { challan_no, status, created_at } = params.where || {};

  let whereStr = "1=1";
  const queryParams: any[] = [];

  if (challan_no) {
    whereStr += " AND c.challan_no = ?";
    queryParams.push(challan_no);
  }

  if (status) {
    whereStr += " AND c.status = ?";
    queryParams.push(status);
  }

  if (created_at) {
    whereStr += " AND c.updated_at BETWEEN ? AND ?";
    queryParams.push(created_at.gte, created_at.lte);
  }

  const query = `
    SELECT 
      c.*,
      fb.name as from_branch_name,
      tb.name as to_branch_name
    FROM challans c
    LEFT JOIN branches fb ON c.from_branch_id = fb.id
    LEFT JOIN branches tb ON c.to_branch_id = tb.id
    WHERE ${whereStr}
    ORDER BY c.id DESC
  `;

  const challans = await prisma.$queryRawUnsafe<Array<Challans & ChallanGetPayload>>(query, ...queryParams);
  return challans;
}

export async function deleteChallan(params: {
  where: { id: number };
}) {
  await prisma.challans.delete({ where: { id: BigInt(params.where.id) } });
  return { message: "Challan deleted successfully" };
}

export async function updateChallanStatus(challanId: bigint, tx?: any) {
  const dbs = tx || prisma;
  return await dbs.challans.update({
    where: { id: challanId },
    data: {
      status: "RECEIVED",
      updated_at: new Date(),
    }
  });
}
