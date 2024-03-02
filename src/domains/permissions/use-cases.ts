import { Database } from "arangojs";
import { PermissionCheck } from "./dtos";

import * as GraphUseCases from "@app/use-cases/graph-db";
import { Redis } from "ioredis";

import Repository, {
  ACTIONS,
  PermissionRepository,
  RELATIONSHIPS,
} from "./repo";

export interface CanActorPerformActionOnResourceRequest {
  data: PermissionCheck;
  repositories: {
    Permission: Repository;
  };
  graph: Database;
  cache: Redis;
  permissionMap?: Map<ACTIONS, RELATIONSHIPS[]>;
}

const generateCacheKey = (data: PermissionCheck) =>
  `check::${data.actor}::${data.action}::${data.resource}`;

export const canActorPerformActionOnResource = async (
  request: CanActorPerformActionOnResourceRequest
) => {
  const key = generateCacheKey(request.data);
  const value = await request.cache.get(key);

  if (value) {
    return value === "true";
  }

  // The set of permissions that this sort of action would need
  const neededPermissions =
    await PermissionRepository.actionToNeededRelationships(
      request.data.action,
      await request.repositories.Permission.getPermissionMap()
    );

  /// The set of permissions that this actor has to the resource
  const relationshipsBetweenActorAndResources =
    await GraphUseCases.getRelationships(request.graph, {
      actor: request.data.actor,
      resource: request.data.resource,
    });

  let allowed = false;

  // If any of the relationships are the needed permission,
  // we can say that this actor can perform this action
  // on this specific resource
  for await (const value of relationshipsBetweenActorAndResources) {
    if (neededPermissions.includes(value.relationship)) {
      allowed = true;
      break;
    }
  }

  // Set ttl to 10s
  await request.cache.set(key, allowed.toString(), "EX", 10);

  // The actor does not have any required permission in
  // order to perform the requested action on the requested
  // resource
  return allowed;
};
