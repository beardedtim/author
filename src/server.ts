import express from "express";
import LogMiddleware from "pino-http";
import Cors from "cors";
import swaggerUI from "swagger-ui-express";
import Log from "@app/shared/log";
import router from "./routes";
import fs from "fs";
import path from "path";

const server = express();

const file = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "..", "openapi.json"), "utf8")
);

server
  .use(LogMiddleware({ logger: Log.child({ name: "HTTP" }) }))
  .use(Cors())
  .get("/healthcheck", (_, res) => {
    res.json({
      data: "healthy",
    });
  })
  .use("/api/v1", router)
  .use("/docs", swaggerUI.serve, swaggerUI.setup(file, { explorer: true }));

export default server;
