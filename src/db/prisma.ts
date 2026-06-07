import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __bizposPrisma__: PrismaClient | undefined;
}

const prisma = global.__bizposPrisma__ ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__bizposPrisma__ = prisma;
}

export default prisma;
