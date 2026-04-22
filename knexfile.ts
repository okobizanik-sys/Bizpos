import { Knex } from "knex";
import dotenv from "dotenv";
import { getKnexConfig } from "./src/db/knex-config";

dotenv.config();

const config: Knex.Config = getKnexConfig();

export default config;
