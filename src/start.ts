import Log from "@app/shared/log";
import { migrator } from "@app/connections/database/migrate";
import * as GraphUseCases from "@app/use-cases/graph-db";
import { db as graphDb } from "@app/connections/graph";
import server from "./server";
import { getEnv } from "./shared/env";

const init = async () => {
  Log.debug("Initting the system");
  const result = await migrator.migrateUp();

  Log.debug({ result }, "Migrated SQL database");

  await GraphUseCases.migrate(graphDb);
  Log.debug("Migrated Graph Database");
};

const main = async () => {
  Log.debug("Starting the system");
  const port = getEnv("PORT", 5000);

  server.listen(port, () => Log.trace({ port }, "Listening"));
};

init()
  .then(main)
  .catch((err) => {
    Log.fatal({ err }, "Error during startup");
  });
