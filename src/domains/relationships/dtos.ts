import { z } from "zod";

export const NewRelationshipSchema = z.object({
  actor: z.string().uuid(),
  resource: z.string().uuid(),
  relationship: z.string(),
});

export type NewRelationship = z.infer<typeof NewRelationshipSchema>;

export const RelationshipSchema = NewRelationshipSchema;
export type Relationship = NewRelationship;
