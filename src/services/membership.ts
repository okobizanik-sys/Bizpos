"use server";

import db from "@/db/database";
import { Memberships } from "@/types/shared";

// Get all memberships
export async function getMemberships(): Promise<Memberships[]> {
  return await db("memberships").select("memberships.*").orderBy("type", "asc");
}

// Get a specific membership by unique identifier
export async function getMembership(params: {
  where: { id: number }; // Adjust the type based on your unique identifier
}) {
  const membership = await db("memberships").where(params.where).first();
  if (!membership) {
    throw new Error("Membership not found");
  }
  return membership;
}

// Create a new membership
export async function createMembership(data: { type: string }) {
  const [insertedData] = await db("memberships").insert(data);
  const lastInsertedId = insertedData;

  const [membership] = await db("memberships").where({ id: lastInsertedId });
  return membership;
}

// Update an existing membership
export async function updateMembership(params: {
  where: { id: number }; // Adjust the type based on your unique identifier
  data: { type?: string; description?: string }; // Adjust fields based on your membership model
}) {
  const [membership] = await db("memberships")
    .where(params.where)
    .update(params.data)
    .returning("*");
  if (!membership) {
    throw new Error("Membership not found");
  }
  return membership;
}

// Delete a membership
export async function deleteMembership(params: {
  where: { id: number }; // Adjust the type based on your unique identifier
}) {
  const deletedCount = await db("memberships").where(params.where).del();
  if (deletedCount === 0) {
    throw new Error("Membership not found");
  }
  return { message: "Membership deleted successfully" };
}
