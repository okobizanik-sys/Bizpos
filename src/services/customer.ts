"use server";

import prisma from "@/db/prisma";
import { logger } from "../lib/winston";
import { Customers, CustomerWithOrders } from "@/types/shared";
import { CustomerFilter } from "@/app/(admin-panel)/customers/customers-list/page";
import { Prisma } from "@/generated/prisma";

export interface CustomerWithRelations {
  id: number;
  name: string;
  email?: string;
  membership?: any;
  group?: any;
}

export async function createCustomer(data: Customers) {
  const { id, ...createData } = data as any;
  const customer = await prisma.customers.create({ data: createData });
  logger.info(`Customer created successfully: ${customer.id}`);
  return customer;
}

export async function getCustomers(params: {
  where: any;
  filters?: CustomerFilter;
}): Promise<any[]> {
  let whereStr = "1=1";
  const queryParams: any[] = [];
  
  if (params.where) {
    for (const [key, value] of Object.entries(params.where)) {
       whereStr += ` AND customers.${key} = ?`;
       queryParams.push(value);
    }
  }

  if (params.filters) {
    const { search, group, membership } = params.filters;
    if (search) {
      whereStr += ` AND (customers.customer LIKE ? OR customers.phone LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    if (group) {
      whereStr += ` AND groups.name = ?`;
      queryParams.push(group);
    }
    if (membership) {
      whereStr += ` AND memberships.type = ?`;
      queryParams.push(membership);
    }
  }

  const query = Prisma.sql`
    SELECT customers.*, groups.name as groupName, memberships.type as membershipType
    FROM customers
    LEFT JOIN groups ON customers.group_id = groups.id
    LEFT JOIN memberships ON customers.membership_id = memberships.id
    WHERE ${Prisma.raw(whereStr)}
    GROUP BY customers.customer, customers.phone, customers.address, customers.id
    ORDER BY customers.created_at DESC
  `;

  // Prisma.$queryRawUnsafe is used because of dynamic parameter construction which Prisma.sql handles a bit differently if built as string
  const customers = await prisma.$queryRawUnsafe(
    `SELECT customers.*, groups.name as groupName, memberships.type as membershipType
    FROM customers
    LEFT JOIN groups ON customers.group_id = groups.id
    LEFT JOIN memberships ON customers.membership_id = memberships.id
    WHERE ${whereStr}
    GROUP BY customers.id, customers.customer, customers.phone, customers.address
    ORDER BY customers.created_at DESC`,
    ...queryParams
  );

  return customers as any[];
}

export async function getUniqueCustomers(params: {
  where: any;
  filters?: CustomerFilter;
}): Promise<any[]> {
  let whereStr = "1=1";
  const queryParams: any[] = [];
  
  if (params.where) {
    for (const [key, value] of Object.entries(params.where)) {
       whereStr += ` AND customers.${key} = ?`;
       queryParams.push(value);
    }
  }

  if (params.filters) {
    const { search, group, membership } = params.filters;
    if (search) {
      whereStr += ` AND (customers.customer LIKE ? OR customers.phone LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    if (group) {
      whereStr += ` AND groups.name = ?`;
      queryParams.push(group);
    }
    if (membership) {
      whereStr += ` AND memberships.type = ?`;
      queryParams.push(membership);
    }
  }

  const customers = await prisma.$queryRawUnsafe(
    `SELECT customers.*, groups.name as groupName, memberships.type as membershipType
    FROM customers
    LEFT JOIN groups ON customers.group_id = groups.id
    LEFT JOIN memberships ON customers.membership_id = memberships.id
    WHERE ${whereStr}
    GROUP BY customers.phone, customers.id
    ORDER BY customers.created_at DESC`,
    ...queryParams
  );

  return customers as any[];
}

export async function getCustomersWithOrders(params: {
  where: any;
  filters?: CustomerFilter;
}): Promise<CustomerWithOrders[]> {
  let whereStr = "1=1";
  const queryParams: any[] = [];
  
  if (params.where) {
    for (const [key, value] of Object.entries(params.where)) {
       whereStr += ` AND customers.${key} = ?`;
       queryParams.push(value);
    }
  }

  if (params.filters) {
    const { search, group } = params.filters;
    if (search) {
      whereStr += ` AND (customers.customer LIKE ? OR customers.phone LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    if (group) {
      whereStr += ` AND groups.name = ?`;
      queryParams.push(group);
    }
  }

  const query = `
    SELECT 
      customers.phone, 
      customers.customer as customerName, 
      groups.name as groupName, 
      SUM(orders.total) as amount,
      (SELECT COUNT(*) FROM orders o WHERE o.customer_id IN (SELECT id FROM customers c WHERE c.phone = customers.phone)) as orders,
      (SELECT COUNT(*) FROM orders o WHERE o.customer_id IN (SELECT id FROM customers c WHERE c.phone = customers.phone) AND o.status = 'RETURN') as \`return\`
    FROM customers
    LEFT JOIN groups ON customers.group_id = groups.id
    LEFT JOIN orders ON orders.customer_id = customers.id
    WHERE ${whereStr}
    GROUP BY customers.phone, customers.customer, groups.name, customers.created_at
    ORDER BY customers.created_at DESC
  `;

  const cutomersWithOrders = await prisma.$queryRawUnsafe(query, ...queryParams);
  return cutomersWithOrders as CustomerWithOrders[];
}

export async function getCustomerById(id: number) {
  const customer = await prisma.customers.findFirst({ where: { id } });
  if (!customer) throw new Error("Customer not found");
  return customer;
}

export async function updateCustomer(id: number, data: Customers) {
  const { id: _, ...updateData } = data as any;
  const customer = await prisma.customers.update({ where: { id }, data: updateData });
  return customer;
}

export async function deleteCustomer(id: number) {
  await prisma.customers.delete({ where: { id } });
  return { message: "Customer deleted successfully" };
}
