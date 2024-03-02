import { getEnv } from "@app/shared/env";
import { Database } from "arangojs";

export const db = new Database({
  auth: {
    username: getEnv("GRAPH_USER"),
    password: getEnv("GRAPH_PASS"),
  },
  url: `http://${getEnv("GRAPH_HOST")}:${getEnv("GRAPH_PORT")}`,
});
