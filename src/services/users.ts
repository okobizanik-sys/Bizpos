"use server";

import prisma from "@/db/prisma";
import { User } from "@/types/shared";

const normalizeUserWhere = (where: any) => {
  if (!where || typeof where !== "object") {
    return where;
  }

  if ("users.email" in where && !("email" in where)) {
    return {
      ...where,
      email: where["users.email"],
    };
  }

  return where;
};

export async function getUsers(params: { where: any }): Promise<User[]> {
  // Convert basic where clauses
  const rawUsers = await prisma.$queryRaw<any[]>`
    SELECT u.*, b.name as branchName, b.id as branchId
    FROM users u
    LEFT JOIN branches_users bu ON u.id = bu.user_id
    LEFT JOIN branches b ON bu.branch_id = b.id
    ORDER BY u.created_at DESC
  `;
  // Apply filtering manually or try to translate params.where if needed.
  // The original code passed `params.where` directly to knex. 
  // Let's see if we can do this with prisma findMany and include.
  
  const users = await prisma.users.findMany({
    where: normalizeUserWhere(params.where),
    include: {
      branches_users: {
        include: {
          branches: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  return users.map(u => ({
    id: u.id,
    name: u.name || undefined,
    email: u.email,
    password: u.password || '',
    email_verified: !!u.email_verified,
    role: u.role,
    phone: u.phone || undefined,
    branchName: u.branches_users[0]?.branches?.name || undefined,
    branchId: u.branches_users[0]?.branches?.id || 0,
  }));
}

export async function getUser(params: { where: any }): Promise<User | null> {
  const user = await prisma.users.findFirst({
    where: normalizeUserWhere(params.where),
    include: {
      branches_users: {
        include: {
          branches: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name || undefined,
    email: user.email,
    password: user.password || '',
    email_verified: !!user.email_verified,
    role: user.role,
    phone: user.phone || undefined,
    branchName: user.branches_users[0]?.branches?.name || undefined,
    branchId: user.branches_users[0]?.branches?.id || 0,
  };
}
