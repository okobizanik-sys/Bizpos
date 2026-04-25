"use server"
import { AuthError } from "next-auth";
import { signIn } from "@/lib/next-auth";
import { logger } from "@/lib/winston";

const getLoginErrorMessage = (error: unknown) => {
  if (error instanceof AuthError) {
    if (error.type === "CredentialsSignin") {
      const code = "code" in error ? String(error.code || "") : "";

      if (code === "database_unavailable") {
        return "Database connection failed. Please check MySQL server and DB_HOST.";
      }

      if (code === "branch_required") {
        return "No branch assigned to this staff account.";
      }

      return "Invalid email or password.";
    }

    if (error.type === "CallbackRouteError") {
      const causeMessage =
        error.cause?.err instanceof Error
          ? error.cause.err.message
          : String(error.cause?.err || "");

      if (
        causeMessage.includes("KnexTimeoutError") ||
        causeMessage.includes("ETIMEDOUT") ||
        causeMessage.includes("ECONNREFUSED")
      ) {
        return "Database connection failed. Please check MySQL server and DB_HOST.";
      }
    }
  }

  const message = error instanceof Error ? error.message : String(error);

  if (
    message.includes("KnexTimeoutError") ||
    message.includes("ETIMEDOUT") ||
    message.includes("ECONNREFUSED") ||
    message.includes("CallbackRouteError") ||
    message.toLowerCase().includes("callbackrouteerror")
  ) {
    return "Database connection failed. Please check MySQL server and DB_HOST.";
  }

  if (
    message.includes("CredentialsSignin") ||
    message.includes("Invalid credentials")
  ) {
    return "Invalid email or password.";
  }

  return message;
};

export const loginUser = async (formData: FormData) => {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    branchId: formData.get("branchId") as string,
  };
  // console.log(data, ":user from login form action");

  try {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      branchId: data.branchId,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return true;
  } catch (error: any) {
    logger.error(error);

    throw new Error(getLoginErrorMessage(error));
  }
};
