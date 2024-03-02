import { Actor, NewActor } from "./dtos";
import { Database } from "arangojs";
import * as GraphUseCases from "@app/use-cases/graph-db";
import Repository from "./repo";

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

export const create = async (request: CreateActorRequest): Promise<Actor> => {
  const actor = await request.repositories.Actor.add(request.data);

  await GraphUseCases.addActor(request.graph, actor._id);

  return actor;
};

export const getById = (request: GetActorByIdRequest): Promise<Actor> =>
  request.repositories.Actor.getById(request.data);
