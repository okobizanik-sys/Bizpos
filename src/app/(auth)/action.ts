"use server"

import { signIn } from "@/lib/next-auth";
import { logger } from "@/lib/winston";

export const loginUser = async (formData: FormData) => {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  // console.log(data, ":user from login form action");

  try {
    await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    return true;
  } catch (error: any) {
    logger.error(error);

    throw new Error(error.message);
  }
};