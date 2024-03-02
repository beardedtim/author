import express from "express";
import LogMiddleware from "pino-http";
import Cors from "cors";

import Log from "@app/shared/log";
import v1 from "./v1";

const server = express();

server
  .use(LogMiddleware({ logger: Log.child({ name: "HTTP" }) }))
  .use(Cors())
  .get("/healthcheck", (_, res) => {
    res.json({
      data: "healthy",
    });
  })
  .use("/api/v1", v1);

export default server;
