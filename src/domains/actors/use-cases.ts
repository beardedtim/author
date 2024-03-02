import { Actor, NewActor } from "./dtos";
import { Database } from "arangojs";
import * as GraphUseCases from "@app/use-cases/graph-db";
import Repository from "./repo";
import { runInContext } from "@app/shared/utils";

export interface CreateActorRequest {
  data: NewActor;
  repositories: {
    Actor: Repository;
  };
  graph: Database;
}

export interface GetActorByIdRequest {
  data: string;
  repositories: {
    Actor: Repository;
  };
}

export const create = runInContext(
  async (request: CreateActorRequest): Promise<Actor> => {
    const actor = await request.repositories.Actor.add(request.data);

    await GraphUseCases.addActor(request.graph, actor._id);

    return actor;
  },
  "create-actor-use-case"
);

export const getById = runInContext(
  (request: GetActorByIdRequest): Promise<Actor> =>
    request.repositories.Actor.getById(request.data),
  "get-actor-by-id-use-case"
);
