"use server";

import db from "@/db/database";
import { logger } from "@/lib/winston";
import { revalidatePath } from "next/cache";

export async function staffSettingsAction(formData: FormData) {
  try {
    await db.transaction(async (trx) => {
      const password = formData.get("password");
      var bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash(password, 10);

      const staffInfo = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: hashedPassword,
        phone: formData.get("phone"),
        role: formData.get("designation"),
      };

      const [insertResult] = await trx("users").insert(staffInfo);
      const lastInserted = insertResult;
      const [user] = await trx("users").where({ id: insertResult });

      logger.info(`User created successfully: ${user.id}`);

      const branchUserInfo = {
        branch_id: Number(formData.get("branchId")),
        user_id: Number(user.id),
      };

      const [branchUser] = await trx("branches_users").insert(branchUserInfo);
      logger.info(`Branch-User created successfully: ${branchUser}`);

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
    await db.transaction(async (trx) => {
      const password = formData.get("password");
      var bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash(password, 10);

      const staffInfo = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: hashedPassword,
        phone: formData.get("phone"),
        role: formData.get("designation"),
      };

      const user = await trx("users").where({ id: id }).update(staffInfo);

      logger.info(`User updated successfully: ${user}`);

      const branchUserInfo = {
        branch_id: Number(formData.get("branchId")),
        user_id: Number(id),
      };

      const branchUser = await trx("branches_users")
        .where({ user_id: id })
        .update(branchUserInfo);
      logger.info(`Branch-User updated successfully: ${branchUser}`);

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
    const deletedUser = await db("users").where({ id: id }).del();

    revalidatePath("/dashboard");
    revalidatePath("/staffs");

    return deletedUser;
  } catch (error) {
    console.error(error);
  }
}
