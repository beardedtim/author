import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { Logger } from "pino";

export enum RELATIONSHIPS {
  OWN = "owns",
  READ = "reads",
  WRITE = "edits",
  DELETE = "delete",
}

export enum ACTIONS {
  READ = "read",
  DELETE = "delete",
  EDIT = "edit",
}

export class PermissionRepository {
  private db: Kysely<DB>;
  private log: Logger;

  constructor(db: Kysely<DB>, log: Logger) {
    this.db = db;
    this.log = log;
  }
  /**
   * Given some action to be done on a resource,
   * return a list of permissions that one would
   * need at least one of in order to be able to
   * perform that action
   */
  static actionToNeededRelationships(
    actionName: ACTIONS,
    actionMap: Map<ACTIONS, RELATIONSHIPS[]>
  ) {
    // If you have owns, you can do anything
    const permissions = new Set([RELATIONSHIPS.OWN]);

    for (const [action, relationships] of actionMap.entries()) {
      if (actionName === action) {
        relationships.forEach((relationship) => permissions.add(relationship));
      }
    }

    return [...permissions.values()];
  }

  static generateDefaultPermissionMap() {
    const defaultPermissionMap = new Map<ACTIONS, RELATIONSHIPS[]>();

    defaultPermissionMap.set(ACTIONS.READ, [
      RELATIONSHIPS.READ,
      RELATIONSHIPS.OWN,
    ]);

    defaultPermissionMap.set(ACTIONS.DELETE, [
      RELATIONSHIPS.DELETE,
      RELATIONSHIPS.OWN,
    ]);

    defaultPermissionMap.set(ACTIONS.EDIT, [
      RELATIONSHIPS.WRITE,
      RELATIONSHIPS.OWN,
    ]);

    return defaultPermissionMap;
  }

  async getPermissionMap(id?: string) {
    if (!id) {
      return PermissionRepository.generateDefaultPermissionMap();
    }

    try {
      const result = await this.db
        .selectFrom("permission_maps")
        .where("_id", "=", id)
        .selectAll()
        .execute();

      return result.reduce((map, perm) => {
        const { action, relationships } = perm as {
          action: ACTIONS;
          relationships: RELATIONSHIPS[];
        };

        const list = map.get(action) || [];

        map.set(action, list.concat(...relationships));

        return map;
      }, new Map<ACTIONS, RELATIONSHIPS[]>());
    } catch (err) {
      this.log.warn({ err }, "Error getting permission map. Returning default");

      return PermissionRepository.generateDefaultPermissionMap();
    }
  }
}

export default PermissionRepository;
