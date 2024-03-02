import Log from "@app/shared/log";
import { db } from "@app/connections/database";
import { migrator } from "@app/connections/database/migrate";

migrator.migrateUp().then(async (result) => {
  Log.debug({ result }, "Migrated Database");

  await db.destroy();
});
