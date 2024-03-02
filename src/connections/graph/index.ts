import config from "@app/shared/config";
import { Database } from "arangojs";

export const db = new Database({
  auth: {
    username: config.graph.username,
    password: config.graph.password,
  },
  url: `http://${config.graph.host}:${config.graph.port}`,
});
