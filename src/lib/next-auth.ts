import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import db from "@/db/database";
import { logger } from "./winston";
import { KnexAdapter } from "authjs-knexjs-adapter";
import { getUser } from "@/services/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 3 * 60 * 60 },

  adapter: KnexAdapter(db),

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
      },

      async authorize(credentials) {
        // Type assertions to ensure credentials are treated as strings
        const email = credentials.email as string;
        const password = credentials.password;

        if (!email || !password) throw new Error("Missing credentials");

        // Query to find the user by email in the 'users' table
        // const user = await db("users")
        //   .select("users.*")
        //   .where({ email: email })
        //   .first();
        const user = await getUser({ where: { "users.email": email } });

        // console.log(user, ": user from next auth");

        if (!user || !(await compare(password as string, user.password))) {
          throw new Error("Invalid credentials");
        }

        logger.info(`User logged in successfully: ${user.id}`); // Log successful login
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          branchId: String(user.branchId),
        };
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
