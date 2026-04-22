import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import { compare } from "bcryptjs";
import { logger } from "./winston";
import { getUser } from "@/services/users";

class DatabaseUnavailableError extends CredentialsSignin {
  code = "database_unavailable";
}

class BranchAssignmentError extends CredentialsSignin {
  code = "branch_required";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 3 * 60 * 60 },

  providers: [
    CredentialsProvider({
      name: "Sign in",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
        branchId: {
          label: "Branch",
          type: "text",
          placeholder: "Select branch",
        },
      },

      async authorize(credentials) {
        try {
          const email = String(credentials.email || "").trim();
          const password = String(credentials.password || "");

          if (!email || !password) {
            return null;
          }

          const user = await getUser({ where: { "users.email": email } });

          if (!user?.password) {
            return null;
          }

          const passwordMatches = await compare(password, user.password);

          if (!passwordMatches) {
            return null;
          }

          let branchId = String(user.branchId || "");

          if (user.role === "ADMIN") {
            branchId = "";
          } else if (!branchId) {
            logger.warn(`Staff user ${user.id} has no branch assigned.`);
            throw new BranchAssignmentError();
          }

          logger.info(`User logged in successfully: ${user.id}`);
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            branchId,
          };
        } catch (error) {
          logger.error("Authorization failed:", error);

          if (error instanceof CredentialsSignin) {
            throw error;
          }

          throw new DatabaseUnavailableError();
        }
      },
    }),
  ],

  // Add the role to the JWT token
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user role in the token
      if (user) {
        token.role = user.role;
        token.branchId = user.branchId;
      }
      return token;
    },

    async session({ session, token }) {
      // Type assertion to ensure TypeScript knows the shape of the session.user
      session.user = {
        ...session.user,
        role: token.role as string,
        branchId: token.branchId as string,
      };
      return session;
    },
  },
  trustHost: true,

  secret: process.env.AUTH_SECRET,
});
