import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  // eslint-disable-next-line no-var
  var __bizposPrisma__: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable");
}

const adapter = new PrismaMariaDb(databaseUrl);

const prisma = global.__bizposPrisma__ ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.__bizposPrisma__ = prisma;
}

export default prisma;
