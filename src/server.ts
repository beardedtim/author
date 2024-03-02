import express, { Handler } from "express";
import LogMiddleware from "pino-http";
import Cors from "cors";

import Log from "@app/shared/log";
import * as Middleware from "./middleware";
import v1 from "./v1";
import { runInContext } from "@app/shared/utils";

const server = express();

server
  .use(Middleware.globalCtx())
  .use(
    runInContext<Handler>(
      LogMiddleware({ logger: Log.child({ name: "HTTP" }) }),
      "logging-middleware"
    )
  )
  .use(runInContext(Cors(), "cors-middleware"))
  .get(
    "/healthcheck",
    runInContext<Handler>((_, res) => {
      Log.trace(
        "Healtcheck not implemented. Returing yes even though we didn't do anything."
      );

      res.json({
        data: "healthy",
      });
    }, "healthcheck-route")
  )
  .use("/api/v1", runInContext<Handler>(v1, "v1-router"));

export default server;
