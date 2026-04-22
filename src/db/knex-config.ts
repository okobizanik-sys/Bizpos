import fs from "fs";
import { Knex } from "knex";

const LOCAL_DB_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const isDockerRuntime = () => {
  try {
    return fs.existsSync("/.dockerenv");
  } catch {
    return false;
  }
};

const resolveDbHost = () => {
  const configuredHost = process.env.DB_HOST?.trim();

  if (isDockerRuntime()) {
    if (!configuredHost || LOCAL_DB_HOSTS.has(configuredHost)) {
      return process.env.DB_DOCKER_HOST?.trim() || "bizpos-db";
    }
  }

  return configuredHost || "127.0.0.1";
};

const resolveDbPassword = () => {
  const configuredPassword = process.env.DB_PASSWORD ?? "";
  const user = (process.env.DB_USER || "").trim().toLowerCase();

  if (configuredPassword) {
    return configuredPassword;
  }

  if (isDockerRuntime() && user === "root") {
    return process.env.DB_ROOT_PASSWORD || "";
  }

  return "";
};

export const getKnexConfig = (): Knex.Config => ({
  client: "mysql2",
  connection: {
    host: resolveDbHost(),
    port: toNumber(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || "",
    password: resolveDbPassword(),
    database: process.env.DB_NAME || "",
    connectTimeout: toNumber(process.env.DB_CONNECT_TIMEOUT, 5000),
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  },
  migrations: {
    directory: "./migrations",
  },
  pool: {
    min: 0,
    max: toNumber(process.env.DB_POOL_MAX, 10),
    acquireTimeoutMillis: toNumber(process.env.DB_ACQUIRE_TIMEOUT, 15000),
    createTimeoutMillis: toNumber(process.env.DB_CREATE_TIMEOUT, 5000),
    idleTimeoutMillis: toNumber(process.env.DB_IDLE_TIMEOUT, 30000),
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 500,
    propagateCreateError: false,
  },
  acquireConnectionTimeout: toNumber(process.env.DB_ACQUIRE_TIMEOUT, 15000),
});
