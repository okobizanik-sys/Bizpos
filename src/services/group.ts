"use server";

import db from "@/db/database";
import { Groups } from "@/types/shared";

// Get all groups
export async function getGroups(): Promise<Groups[]> {
  const groups = await db("groups").select("groups.*").orderBy("name", "asc");
  return groups;
}

// Get a specific group by unique identifier
export async function getGroup(params: {
  where: { id: number }; // Adjust according to your unique identifier
}) {
  const group = await db("groups").where(params.where).first();
  if (!group) {
    throw new Error("Group not found");
  }
  return group;
}

// Create a new group
export async function createGroup(data: { name: string }) {
  const [insertedData] = await db("groups").insert(data);
  const lastInsertedId = insertedData;

  const [group] = await db("groups").where({ id: lastInsertedId });
  return group;
}

// Update an existing group
export async function updateGroup(params: {
  where: { id: number }; // Adjust according to your unique identifier
  data: { name?: string }; // Adjust fields as necessary
}) {
  const [group] = await db("groups")
    .where(params.where)
    .update(params.data)
    .returning("*");
  if (!group) {
    throw new Error("Group not found");
  }
  return group;
}

// Delete a group
export async function deleteGroup(params: {
  where: { id: number }; // Adjust according to your unique identifier
}) {
  const deletedCount = await db("groups").where(params.where).del();
  if (deletedCount === 0) {
    throw new Error("Group not found");
  }
  return { message: "Group deleted successfully" };
}
