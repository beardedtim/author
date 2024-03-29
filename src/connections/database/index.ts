import { DB } from "kysely-codegen";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import config from "@app/shared/config";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: config.database.name,
    host: config.database.host,
    user: config.database.user,
    port: config.database.port,
    password: config.database.password,
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
