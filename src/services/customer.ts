"use server";

import db from "@/db/database";
import { logger } from "../lib/winston";
import { Customers, CustomerWithOrders } from "@/types/shared";
import { CustomerFilter } from "@/app/(admin-panel)/customers/customers-list/page";

export interface CustomerWithRelations {
  id: number;
  name: string;
  email?: string;
  membership?: any;
  group?: any;
}

export async function createCustomer(data: Customers) {
  const [insertResult] = await db("customers").insert(data);
  const lastInsertId = insertResult;

  const [customer] = await db("customers").where({ id: lastInsertId });
  logger.info(`Customer created successfully: ${customer.id}`);
  return customer;
}

export async function getCustomers(params: {
  where: {};
  filters?: CustomerFilter;
}): Promise<Customers[]> {
  const query = db("customers")
    .where(params.where)
    .leftJoin("groups", "customers.group_id", "groups.id")
    .leftJoin("memberships", "customers.membership_id", "memberships.id")
    .select(
      "customers.*",
      "groups.name as groupName",
      "memberships.type as membershipType"
    )
    .groupBy("customers.customer", "customers.phone", "customers.address")
    .orderBy("created_at", "desc");

  if (params.filters) {
    const { search, group, membership } = params.filters;

    if (search) {
      query.where(function () {
        this.where("customers.customer", "LIKE", `%${search}%`).orWhere(
          "customers.phone",
          "LIKE",
          `%${search}%`
        );
      });
    }

    if (group) {
      query.andWhere("groups.name", group);
    }

    if (membership) {
      query.andWhere("memberships.type", membership);
    }
  }

  const customers = await query;
  return customers;
}

export async function getUniqueCustomers(params: {
  where: {};
  filters?: CustomerFilter;
}): Promise<Customers[]> {
  const query = db("customers")
    .where(params.where)
    .leftJoin("groups", "customers.group_id", "groups.id")
    .leftJoin("memberships", "customers.membership_id", "memberships.id")
    .select(
      "customers.*",
      "groups.name as groupName",
      "memberships.type as membershipType"
    )
    .groupBy("customers.phone")
    .orderBy("created_at", "desc");

  if (params.filters) {
    const { search, group, membership } = params.filters;

    if (search) {
      query.where(function () {
        this.where("customers.customer", "LIKE", `%${search}%`).orWhere(
          "customers.phone",
          "LIKE",
          `%${search}%`
        );
      });
    }

    if (group) {
      query.andWhere("groups.name", group);
    }

    if (membership) {
      query.andWhere("memberships.type", membership);
    }
  }

  const customers = await query;
  return customers;
}

export async function getCustomersWithOrders(params: {
  where: {};
  filters?: CustomerFilter;
}): Promise<CustomerWithOrders[]> {
  const query = db("customers")
    .where(params.where)
    .leftJoin("groups", "customers.group_id", "groups.id")
    .leftJoin("orders", "orders.customer_id", "customers.id")
    .select(
      "customers.phone",
      "customers.customer as customerName",
      "groups.name as groupName",
      db.raw("SUM(orders.total) as amount"),
      db.raw(
        "(SELECT COUNT(*) FROM orders o WHERE o.customer_id IN (SELECT id FROM customers c WHERE c.phone = customers.phone)) as orders"
      ),
      db.raw(
        "(SELECT COUNT(*) FROM orders o WHERE o.customer_id IN (SELECT id FROM customers c WHERE c.phone = customers.phone) AND o.status = 'RETURN') as `return`"
      )
    )
    .groupBy("customers.phone")
    .orderBy("customers.created_at", "desc");

  if (params.filters) {
    const { search, group } = params.filters;

    if (search) {
      query.where(function () {
        this.where("customers.customer", "LIKE", `%${search}%`).orWhere(
          "customers.phone",
          "LIKE",
          `%${search}%`
        );
      });
    }

    if (group) {
      query.andWhere("groups.name", group);
    }
  }

  const cutomersWithOrders = await query;
  return cutomersWithOrders;
}

export async function getCustomerById(id: number) {
  const customer = await db("customers").where({ id }).first();
  if (!customer) {
    throw new Error("Customer not found");
  }
  return customer;
}

export async function updateCustomer(id: number, data: Customers) {
  const insertResult = await db("customers").where({ id }).update(data);
  const lastInsertId = insertResult;

  const [customer] = await db("customers").where({ id: lastInsertId });
  return customer;
}

export async function deleteCustomer(id: number) {
  const deletedCount = await db("customers").where({ id }).del();
  if (deletedCount === 0) {
    throw new Error("Customer not found");
  }
  return { message: "Customer deleted successfully" };
}
