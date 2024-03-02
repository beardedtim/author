import { z } from "zod";

export const NewResourceSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
});

export type NewResource = z.infer<typeof NewResourceSchema>;

export const ResourceSchema = z.object({
  _id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
});

export type Resource = z.infer<typeof ResourceSchema>;
