import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    branchId: string;
  }

  interface Session {
    user: {
      role: string;
      branchId: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    role: string;
    branchId: string;
  }
}
