"use server";

import prisma from "@/db/prisma";
import { logger } from "@/lib/winston";
import { revalidatePath } from "next/cache";

export async function staffSettingsAction(formData: FormData) {
  try {
    await prisma.$transaction(async (tx) => {
      const password = formData.get("password") as string;
      var bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash(password, 10);

      const staffInfo = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: hashedPassword,
        phone: formData.get("phone") as string,
        role: formData.get("designation") as string,
      };

      const user = await tx.users.create({ data: staffInfo as any });

      logger.info(`User created successfully: ${user.id}`);

      const branchUserInfo = {
        branch_id: Number(formData.get("branchId")),
        user_id: Number(user.id),
      };

      const branchUser = await tx.branches_users.create({ data: branchUserInfo });
      logger.info(
        `Branch-User created successfully: ${branchUser.branch_id}-${branchUser.user_id}`
      );

      revalidatePath("/dashboard");
      revalidatePath("/staffs");

      return { user, branchUser };
    });
    return { success: true, message: "staff creation successful" };
  } catch (error) {
    logger.info(error);
    throw error;
  }
}

export async function updateStaffFormAction(id: number, formData: FormData) {
  try {
    await prisma.$transaction(async (tx) => {
      const password = formData.get("password") as string;
      var bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash(password, 10);

      const staffInfo = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: hashedPassword,
        phone: formData.get("phone") as string,
        role: formData.get("designation") as string,
      };

      const user = await tx.users.update({
        where: { id },
        data: staffInfo as any
      });

      logger.info(`User updated successfully: ${user.id}`);

      const branchUserInfo = {
        branch_id: Number(formData.get("branchId")),
        user_id: Number(id),
      };

      const branchUser = await tx.branches_users.updateMany({
        where: { user_id: id },
        data: branchUserInfo
      });
      
      logger.info(`Branch-User updated successfully: ${branchUser.count}`);

      revalidatePath("/dashboard");
      revalidatePath("/staffs");

      return { user, branchUser };
    });
    return { success: true, message: "staff creation successful" };
  } catch (error) {
    logger.info(error);
    throw error;
  }
}

export async function deleteStaffOnConfirmed(id: number) {
  try {
    const deletedUser = await prisma.users.delete({ where: { id } });

    revalidatePath("/dashboard");
    revalidatePath("/staffs");

    return deletedUser;
  } catch (error) {
    console.error(error);
  }
}
