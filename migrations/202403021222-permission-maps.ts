/**
    migration for permission-maps
*/
import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
  await db.schema
    .createTable("permission_maps")
    .addColumn("_id", "uuid", (col) =>
      col
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("action", "text", (col) => col.notNull())
    .addColumn("relationships", sql`text[]`, (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await db.schema.dropTable("permission_maps").execute();
}
