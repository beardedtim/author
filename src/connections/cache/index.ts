import config from "@app/shared/config";
import Redis from "ioredis";

export const cache = new Redis({
  host: config.cache.host,
  port: config.cache.port,
});
