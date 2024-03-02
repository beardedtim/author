import Log from "@app/shared/log";
import { Database } from "arangojs";
import * as GraphUseCases from "@app/use-cases/graph-db";

interface DefineRelationshipRequest {
  data: {
    actor: string;
    relationship: string;
    resource: string;
  };
  graph: Database;
}

export const defineRelationship = async (
  request: DefineRelationshipRequest
) => {
  Log.trace({ data: request.data }, "Defining Relationship");

  try {
    return GraphUseCases.addRelationship(request.graph, request.data);
  } catch (err) {
    Log.warn({ err }, "Error trying to define relationship");

    throw err;
  }
};
