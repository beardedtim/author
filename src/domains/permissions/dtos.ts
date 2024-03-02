import { ACTIONS } from "./repo";
import { z } from "zod";

export const PermissionCheckSchema = z.object({
  actor: z.string().uuid(),
  resource: z.string().uuid(),
  action: z.nativeEnum(ACTIONS),
});

export type PermissionCheck = z.infer<typeof PermissionCheckSchema>;
