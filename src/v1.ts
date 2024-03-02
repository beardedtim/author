import { Router } from "express";
import express from "express";

import Log from "@app/shared/log";

import { db as sqlDB } from "@app/connections/database";
import { db as graphDB } from "@app/connections/graph";
import { cache } from "@app/connections/cache";

import * as ActorsDomain from "@app/domains/actors";
import * as ResourcesDomain from "@app/domains/resources";
import * as RelationshipDomain from "@app/domains/relationships";
import * as PermissionDomain from "@app/domains/permissions";

const actors = Router()
  .post("/", express.json(), async (req, res, next) => {
    try {
      const data = ActorsDomain.DTOS.NewActorSchema.parse(req.body);
      const actorRepo = new ActorsDomain.Repository(sqlDB, Log);

      const result = await ActorsDomain.UseCases.create({
        data,
        repositories: {
          Actor: actorRepo,
        },
        graph: graphDB,
      });

      return res.status(201).json({
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  })
  .get("/:id", async (req, res, next) => {
    try {
      const actorRepo = new ActorsDomain.Repository(sqlDB, Log);

      const result = await ActorsDomain.UseCases.getById({
        data: req.params.id!,
        repositories: {
          Actor: actorRepo,
        },
      });

      return res.json({
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  });

const resources = Router()
  .post("/", express.json(), async (req, res, next) => {
    try {
      const data = ResourcesDomain.DTOS.NewResourceSchema.parse(req.body);
      const resourceRepo = new ResourcesDomain.Repository(sqlDB, Log);

      const result = await ResourcesDomain.UseCases.create({
        data,
        repositories: {
          Resource: resourceRepo,
        },
        graph: graphDB,
      });

      return res.status(201).json({
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  })
  .get("/:id", async (req, res, next) => {
    try {
      const resourceRepo = new ResourcesDomain.Repository(sqlDB, Log);

      const result = await ResourcesDomain.UseCases.getById({
        data: req.params.id!,
        repositories: {
          Resource: resourceRepo,
        },
      });

      return res.json({
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  });

const relationship = Router().post(
  "/",
  express.json(),
  async (req, res, next) => {
    try {
      const data = RelationshipDomain.DTOS.NewRelationshipSchema.parse(
        req.body
      );

      const result = await RelationshipDomain.UseCases.defineRelationship({
        data,
        graph: graphDB,
      });

      return res.status(201).json({
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }
);

const permissions = Router().get(
  "/:actor/:action/:resource",
  async (req, res, next) => {
    try {
      const data = PermissionDomain.DTOS.PermissionCheckSchema.parse({
        actor: req.params.actor!,
        action: req.params.action!,
        resource: req.params.resource!,
      });

      const result =
        await PermissionDomain.UseCases.canActorPerformActionOnResource({
          graph: graphDB,
          data,
          repositories: {
            Permission: new PermissionDomain.Repository(sqlDB, Log),
          },
          cache: cache,
        });

      res.json({ data: result });
    } catch (err) {
      return next(err);
    }
  }
);

const router = Router()
  .use("/actors", actors)
  .use("/resources", resources)
  .use("/relationships", relationship)
  .use("/permissions", permissions);

export default router;
