"use server";

import prisma from "@/db/prisma";
import { logger } from "../lib/winston";
import { ProductFilter } from "@/app/(admin-panel)/inventories/products/page";

export async function getProducts(params: {
  skip?: number;
  take?: number;
  orderBy?: { [key: string]: "asc" | "desc" }[];
  where?: ProductFilter;
}) {
  const { filter_global, filter } = params.where || {};

  let whereStr = "1=1";
  const queryParams: any[] = [];
  const countParams: any[] = [];

  if (filter_global) {
    whereStr += " AND (p.id LIKE ? OR p.name LIKE ? OR p.sku LIKE ?)";
    queryParams.push(`%${filter_global}%`, `%${filter_global}%`, `%${filter_global}%`);
    countParams.push(`%${filter_global}%`, `%${filter_global}%`, `%${filter_global}%`);
  }

  if (filter) {
    whereStr += " AND c.name = ?";
    queryParams.push(filter);
    countParams.push(filter);
  }

  let orderStr = "p.created_at DESC";
  if (params.orderBy && params.orderBy.length > 0) {
    const orders = params.orderBy.flatMap(o => Object.entries(o).map(([k, v]) => `${k} ${v.toUpperCase()}`));
    orderStr = orders.join(", ");
  }

  let limitOffsetStr = "";
  if (params.take) {
    limitOffsetStr += ` LIMIT ${params.take}`;
  }
  if (params.skip) {
    limitOffsetStr += ` OFFSET ${params.skip}`;
  }

  const query = `
    SELECT p.*, c.name as categoryName, b.name as brandName, i.url as imageUrl
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN images i ON p.image_id = i.id
    WHERE ${whereStr}
    ORDER BY ${orderStr}
    ${limitOffsetStr}
  `;

  const countQuery = `
    SELECT COUNT(*) as total
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE ${whereStr}
  `;

  const [products, countResult] = await Promise.all([
    prisma.$queryRawUnsafe<any[]>(query, ...queryParams),
    prisma.$queryRawUnsafe<any[]>(countQuery, ...countParams)
  ]);

  const total = countResult[0]?.total ? Number(countResult[0].total) : 0;

  return { products, total };
}

export async function getProduct(params: any) {
  const query = `
    SELECT 
      p.*, 
      c.name as categoryName, 
      b.name as brandName, 
      i.url as imageUrl,
      s.barcode, 
      s.condition, 
      s.product_id, 
      s.quantity,
      sz.name as sizeName, 
      col.name as colorName, 
      br.name as branchName
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN images i ON p.image_id = i.id
    LEFT JOIN stocks s ON s.product_id = p.id
    LEFT JOIN sizes sz ON s.size_id = sz.id
    LEFT JOIN colors col ON s.color_id = col.id
    LEFT JOIN branches br ON s.branch_id = br.id
    WHERE p.id = ? AND s.condition = 'new'
    GROUP BY s.barcode, p.id, c.name, b.name, i.url, s.condition, s.product_id, s.quantity, sz.name, col.name, br.name
  `;

  const rows = await prisma.$queryRawUnsafe<any[]>(query, params.where.id);
  
  if (!rows || rows.length === 0) {
    return null;
  }

  const product = {
    ...rows[0],
    stocks: rows.map((row) => ({
      barcode: row.barcode,
      quantity: row.quantity,
      size: { name: row.sizeName },
      color: { name: row.colorName },
      branch: { name: row.branchName },
    })),
  };

  return product;
}

export async function getSelectedProduct(params: any) {
  const query = `
    SELECT 
      p.*, 
      c.name as categoryName, 
      b.name as brandName, 
      i.url as imageUrl,
      s.barcode, 
      s.condition, 
      s.product_id, 
      (SELECT COUNT(st.id) FROM stocks st WHERE st.product_id = p.id) as quantity,
      sz.name as sizeName, 
      col.name as colorName, 
      br.name as branchName
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN images i ON p.image_id = i.id
    LEFT JOIN stocks s ON s.product_id = p.id
    LEFT JOIN sizes sz ON s.size_id = sz.id
    LEFT JOIN colors col ON s.color_id = col.id
    LEFT JOIN branches br ON s.branch_id = br.id
    WHERE p.id = ?
    GROUP BY s.id, s.product_id, s.barcode, s.branch_id, s.color_id, s.size_id, p.id, c.name, b.name, i.url, s.condition, sz.name, col.name, br.name
  `;

  const rows = await prisma.$queryRawUnsafe<any[]>(query, params.where.id);
  
  if (!rows || rows.length === 0) {
    return null;
  }

  const product = {
    ...rows[0],
    quantity: Number(rows[0].quantity || 0),
    stocks: rows.map((row) => ({
      barcode: row.barcode,
      size: { name: row.sizeName },
      color: { name: row.colorName },
      branch: { name: row.branchName },
    })),
  };

  return product;
}

export async function createProduct(data: any) {
  const product = await prisma.products.create({ data });
  logger.info(`Product created successfully: ${product.id}`);
  return product;
}

export async function updateProduct(
  params: {
    where: { [key: string]: any };
    data: {
      name?: string;
      sku?: string;
      selling_price?: number;
      description?: string;
      category_id?: number;
      brand_id?: number | null;
      image_id?: number;
    };
  },
  tx?: any
) {
  const dbs = tx || prisma;

  const whereClause = params.where;
  // Convert any string BigInt ids if needed. If it's id, let's keep it generic.
  if (whereClause.id && typeof whereClause.id !== 'bigint') {
    whereClause.id = BigInt(whereClause.id);
  }

  const updatedProduct = await dbs.products.update({
    where: whereClause as any,
    data: params.data
  });

  logger.info(`Product updated successfully: ${updatedProduct.id}`);

  return updatedProduct;
}

export async function deleteProduct(where: { [key: string]: any }) {
  if (where.id && typeof where.id !== 'bigint') {
    where.id = BigInt(where.id);
  }

  const product = await prisma.products.findFirst({ where });

  if (!product) throw new Error("Product not found");

  await prisma.products.delete({ where: where as any });

  logger.info(`Product deleted successfully: ${product.id}`);

  return product;
}
