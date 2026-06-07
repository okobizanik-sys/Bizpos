import knex, { Knex } from "knex";
import { getKnexConfig } from "./knex-config";

declare global {
  // eslint-disable-next-line no-var
  var __bizposKnex__: Knex | undefined;
}

const db = global.__bizposKnex__ ?? knex(getKnexConfig());

if (process.env.NODE_ENV !== "production") {
  global.__bizposKnex__ = db;
}

export default db;
