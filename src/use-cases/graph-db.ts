import { RELATIONSHIPS } from "@app/domains/permissions/repo";
import { allowedToFailWhen, runInContext } from "@app/shared/utils";
import { Database } from "arangojs";
import {
  CollectionType,
  DocumentCollection,
  EdgeCollection,
} from "arangojs/collection";

export const getCollection = runInContext(
  (graph: Database, name: string) => graph.collection(name),
  "get-collection-from-graph"
);

export const createDocumentCollection = runInContext(
  <T extends Record<string, any>>(graph: Database, name: string) => {
    const collection = getCollection(graph, name) as DocumentCollection<T>;

    return collection.create({ type: CollectionType.DOCUMENT_COLLECTION });
  },
  "create-document-collection"
);

export const createEdgeCollection = runInContext(
  <T extends Record<string, any>>(graph: Database, name: string) => {
    const collection = getCollection(graph, name) as EdgeCollection<T>;

    return collection.create({ type: CollectionType.EDGE_COLLECTION });
  },
  "create-edge-collection"
);

export const insertIntoCollection = runInContext(
  (
    collection: DocumentCollection<any> | EdgeCollection<any>,
    value: unknown
  ) => {
    return collection.save(value, { returnNew: true });
  },
  "insert-into-collection"
);

export const addActor = runInContext(async (graph: Database, actor: string) => {
  const collection = await getCollection(graph, "actor");

  return insertIntoCollection(collection, {
    _key: actor,
  });
}, "add-actor-to-graph");

export const addResource = runInContext(
  async (graph: Database, resource: string) => {
    const collection = await getCollection(graph, "resource");

    return insertIntoCollection(collection, {
      _key: resource,
    });
  },
  "add-resource-to-graph"
);

export const addRelationship = runInContext(
  async (
    graph: Database,
    {
      actor,
      resource,
      relationship,
    }: { actor: string; resource: string; relationship: string }
  ) => {
    const collection: EdgeCollection<any> = (await getCollection(
      graph,
      "relationship"
    )) as any;

    return insertIntoCollection(collection, {
      _from: `actor/${actor}`,
      _to: `resource/${resource}`,
      relationship,
    });
  },
  "add-relationship-to-graph"
);

export const getRelationships = runInContext(
  async (
    graph: Database,
    { actor, resource }: { actor: string; resource: string }
  ) =>
    graph.query<{
      relationship: RELATIONSHIPS;
      _key: string;
      _id: string;
      _from: string;
      _to: string;
    }>(`
    FOR relationship IN \`relationship\`
    FILTER relationship._from == 'actor/${actor}' && relationship._to == 'resource/${resource}'
    RETURN relationship
  `),
  "get-relationships-from-graph"
);

export const createGraph = runInContext(
  (
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
  },
  "create-graph"
);

export const migrate = runInContext(async (graph: Database) => {
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
}, "migrate-graph-db");
