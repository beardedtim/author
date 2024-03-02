import { NewResource, Resource } from "./dtos";
import { Database } from "arangojs";
import * as GraphUseCases from "@app/use-cases/graph-db";
import Repository from "./repo";
export interface CreateResourceRequest {
  data: NewResource;
  repositories: {
    Resource: Repository;
  };
  graph: Database;
}

export interface GetResourceByIdRequest {
  data: string;
  repositories: {
    Resource: Repository;
  };
}

export const create = async (
  request: CreateResourceRequest
): Promise<Resource> => {
  const resource = await request.repositories.Resource.add(request.data);

  await GraphUseCases.addResource(request.graph, resource._id);

  return resource;
};

export const getById = (request: GetResourceByIdRequest): Promise<Resource> =>
  request.repositories.Resource.getById(request.data);
