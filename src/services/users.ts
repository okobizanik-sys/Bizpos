"use server";

import db from "@/db/database";
import { User } from "@/types/shared";

export async function getUsers(params: { where: {} }): Promise<User[]> {
  const users = await db("users")
    .leftJoin("branches_users", "users.id", "branches_users.user_id")
    .leftJoin("branches", "branches_users.branch_id", "branches.id")
    .where(params.where)
    .select("users.*", "branches.name as branchName", "branches.id as branchId")
    .orderBy("users.created_at", "desc");

  return users;
}

export async function getUser(params: { where: {} }): Promise<User> {
  const user = await db("users")
    .leftJoin("branches_users", "users.id", "branches_users.user_id")
    .leftJoin("branches", "branches_users.branch_id", "branches.id")
    .where(params.where)
    .select("users.*", "branches.name as branchName", "branches.id as branchId")
    .orderBy("users.created_at", "desc")
    .first();

  return user;
}
