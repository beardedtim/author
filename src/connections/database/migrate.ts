import { promises as fs } from "fs";
import { FileMigrationProvider, Migrator } from "kysely";
import path from "path";

import { db } from "./index";

export const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    // Path to the folder that contains all your migrations.
    migrationFolder: path.resolve(__dirname, "../../../", "migrations"),
  }),
});
