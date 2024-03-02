import { allowedToFailWhen } from "@app/shared/utils";
import { Database } from "arangojs";
import {
  CollectionType,
  DocumentCollection,
  EdgeCollection,
} from "arangojs/collection";

export const getCollection = <T = any>(graph: Database, name: string) => {
  return graph.collection(name) as T;
};

export const createDocumentCollection = <T extends Record<string, any>>(
  graph: Database,
  name: string
) => {
  const collection = getCollection(graph, name) as DocumentCollection<T>;

  return collection.create({ type: CollectionType.DOCUMENT_COLLECTION });
};

export const createEdgeCollection = <T extends Record<string, any>>(
  graph: Database,
  name: string
) => {
  const collection = getCollection(graph, name) as EdgeCollection<T>;

  return collection.create({ type: CollectionType.EDGE_COLLECTION });
};

export const insertIntoCollection = (
  collection: DocumentCollection<any> | EdgeCollection<any>,
  value: unknown
) => {
  return collection.save(value, { returnNew: true });
};

export const addActor = async (graph: Database, actor: string) => {
  const collection = await getCollection(graph, "actor");

  return insertIntoCollection(collection, {
    _key: actor,
  });
};

export const addResource = async (graph: Database, resource: string) => {
  const collection = await getCollection(graph, "resource");

  return insertIntoCollection(collection, {
    _key: resource,
  });
};

export const addRelationship = async (
  graph: Database,
  {
    actor,
    resource,
    relationship,
  }: { actor: string; resource: string; relationship: string }
) => {
  const collection: EdgeCollection<any> = await getCollection(
    graph,
    "relationship"
  );

  return insertIntoCollection(collection, {
    _from: `actor/${actor}`,
    _to: `resource/${resource}`,
    relationship,
  });
};

export const getRelationships = async (
  graph: Database,
  { actor, resource }: { actor: string; resource: string }
) => {
  return graph.query(`
    FOR relationship IN \`relationship\`
    FILTER relationship._from == 'actor/${actor}' && relationship._to == 'resource/${resource}'
    RETURN relationship
  `);
};

export const createGraph = (
  graph: Database,
  { name, from, to }: { name: string; from: string; to: string }
) => {
  return graph.createGraph(name, [
    {
      collection: "relationship",
      from,
      to,
    },
  ]);
};

export const migrate = async (graph: Database) => {
  await allowedToFailWhen(
    () =>
      createGraph(graph, {
        name: "actors-and-resources",
        from: "actor",
        to: "resource",
      }),
    (err: any) => err.message.includes("already exists"),
    "graph actors-and-resources already exists"
  );
};
