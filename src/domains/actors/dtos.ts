import { z } from "zod";

export const NewActorSchema = z.object({
  name: z.string(),
});

export type NewActor = z.infer<typeof NewActorSchema>;

export const ActorSchema = z.object({
  _id: z.string().uuid(),
  name: z.string(),
});

export type Actor = z.infer<typeof ActorSchema>;
