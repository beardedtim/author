import { inContext } from "@app/shared/utils";
import { Handler } from "express";

export const globalCtx = (): Handler => (req, res, next) => {
  return inContext(next, "express-middleware");
};
