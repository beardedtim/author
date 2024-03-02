import { uuid } from "@app/shared/utils";
import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { Logger } from "pino";

class ActorRepository {
  private db: Kysely<DB>;
  private log: Logger;

  constructor(db: Kysely<DB>, log: Logger) {
    this.db = db;
    this.log = log;
  }

  getById(id: string) {
    this.log.trace({ id }, "Getting actor by ID");

    return this.db
      .selectFrom("actors")
      .where("_id", "=", id)
      .selectAll()
      .executeTakeFirstOrThrow();
  }

  add({ name }: { name: string }) {
    const id = uuid();
    this.log.trace({ id }, "Creating new actor");

    return this.db
      .insertInto("actors")
      .values({ _id: id, name })
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}

export default ActorRepository;
