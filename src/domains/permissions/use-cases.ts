import { Database } from "arangojs";

import * as GraphUseCases from "@app/use-cases/graph-db";
import { Redis } from "ioredis";
import Log from "@app/shared/log";
import { PermissionCheck } from "./dtos";

import Repository, { PermissionRepository } from "./repo";
import { runInContext, startTimer } from "@app/shared/utils";

export interface CanActorPerformActionOnResourceRequest {
  data: PermissionCheck;
  repositories: {
    Permission: Repository;
  };
  graph: Database;
  cache: Redis;
}

const generateCacheKey = (data: PermissionCheck) =>
  `check::${data.actor}::${data.action}::${data.resource}`;

const decode = (value: string) => value === "true";
const encode = (value: boolean) => `${value}`;

export const canActorPerformActionOnResource = runInContext(
  async (request: CanActorPerformActionOnResourceRequest) => {
    Log.trace(request.data, "Checking if this is allowed...");
    const timer = startTimer();

    const key = generateCacheKey(request.data);
    const value = await request.cache.get(key);

    if (value) {
      Log.trace(
        { value, key, timer: timer.timeElapsed() },
        "Already asked this so we are returning the result"
      );

      return decode(value);
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
        Log.trace(
          {
            relationship: value.relationship,
            ...request.data,
            timer: timer.timeElapsed(),
          },
          "This action is allowed because of this relationship"
        );

        allowed = true;
        break;
      }
    }

    if (!allowed) {
      Log.trace(
        request.data,
        "This action was not allowed because no relationship found allowing it"
      );
    }

    // Set ttl to 10s
    await request.cache.set(key, encode(allowed), "EX", 10);

    Log.trace(
      { ...request.data, allowed, timer: timer.timeElapsed() },
      "Action allowed"
    );

    // The actor does not have any required permission in
    // order to perform the requested action on the requested
    // resource
    return allowed;
  },
  "check-permissions-use-case"
);
