import { z } from "zod";
import { RELATIONSHIPS } from "../permissions/repo";

export const NewRelationshipSchema = z.object({
  actor: z.string().uuid(),
  resource: z.string().uuid(),
  relationship: z.nativeEnum(RELATIONSHIPS),
});

export type NewRelationship = z.infer<typeof NewRelationshipSchema>;

export const RelationshipSchema = NewRelationshipSchema;
export type Relationship = NewRelationship;
