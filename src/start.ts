import fs from "fs/promises";
import path from "path";

import swaggerUI from "swagger-ui-express";

import Log from "@app/shared/log";
import { db as sqlDb } from "@app/connections/database";
import { migrator } from "@app/connections/database/migrate";
import * as GraphUseCases from "@app/use-cases/graph-db";
import { db as graphDb } from "@app/connections/graph";
import { cache } from "@app/connections/cache";
import server from "@app/server";
import config from "./shared/config";

import { Server } from "http";

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

  let instance: Server;

  const shutdown = async (err?: Error) => {
    Log.trace({ err }, "Getting asking to shutdown gracefully");

    try {
      /**
       * We must first disconnect from the HTTP interface
       * so that we stop any requests before we close
       * the connections
       */
      if (instance) {
        await new Promise((res, rej) => {
          instance.close((err) => {
            if (err) {
              return rej(err);
            }

            res(void 0);
          });
        });
      }

      /**
       * Close connections
       */
      await sqlDb.destroy();
      await cache.disconnect();
      await graphDb.close();

      Log.trace("Successfully shutdown system gracefully");

      /**
       * If we are shutting down because of an error,
       * we want to exit 1 so that the manager knows
       * there is an issue
       */
      process.exit(err ? 1 : 0);
    } catch (shutdownErr) {
      Log.fatal({ err: shutdown }, "Error trying to shutdown gracefully");
      process.exit(1);
    }
  };

  process
    .on("SIGTERM", () => {
      shutdown();
    })
    .on("SIGINT", () => {
      shutdown();
    })
    .on("uncaughtException", shutdown)
    .on("unhandledRejection", shutdown);

  server.listen(port, () => Log.trace({ port }, "Listening"));
};

init()
  .then(main)
  .catch((err) => {
    Log.fatal({ err }, "Error during startup");
  });
