import { uuid } from "@app/shared/utils";
import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { Logger } from "pino";

class ResourceRepository {
  private db: Kysely<DB>;
  private log: Logger;

  constructor(db: Kysely<DB>, log: Logger) {
    this.db = db;
    this.log = log;
  }

  getById(id: string) {
    this.log.trace({ id }, "Getting resource by ID");

    return this.db
      .selectFrom("resources")
      .where("_id", "=", id)
      .selectAll()
      .executeTakeFirstOrThrow();
  }

  add({ name, description }: { name: string; description: string | null }) {
    const id = uuid();
    this.log.trace({ id, name, description }, "Creating new resource");

    return this.db
      .insertInto("resources")
      .values({ _id: id, name, description })
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}

export default ResourceRepository;
