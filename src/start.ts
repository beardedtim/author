import fs from "fs/promises";
import path from "path";

import swaggerUI from "swagger-ui-express";

import Log from "@app/shared/log";
import { migrator } from "@app/connections/database/migrate";
import * as GraphUseCases from "@app/use-cases/graph-db";
import { db as graphDb } from "@app/connections/graph";
import server from "@app/server";
import config from "./shared/config";

const init = async () => {
  Log.debug("Initting the system");
  const result = await migrator.migrateUp();

  Log.debug({ result }, "Migrated SQL database");

  await GraphUseCases.migrate(graphDb);
  Log.debug("Migrated Graph Database");
};

const main = async () => {
  Log.debug("Starting the system");
  const port = config.general.port;

  const file = JSON.parse(
    await fs.readFile(path.resolve(__dirname, "..", "openapi.json"), "utf8")
  );

  server.use(
    "/docs",
    swaggerUI.serve,
    swaggerUI.setup(file, { explorer: true })
  );

  server.listen(port, () => Log.trace({ port }, "Listening"));
};

init()
  .then(main)
  .catch((err) => {
    Log.fatal({ err }, "Error during startup");
  });
