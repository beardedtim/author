import { DB } from "kysely-codegen";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { getEnv } from "@app/shared/env";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: getEnv("DB_NAME"),
    host: getEnv("DB_HOST"),
    user: getEnv("DB_USER"),
    port: getEnv("DB_PORT"),
    password: getEnv("DB_PASS"),
    max: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
});
