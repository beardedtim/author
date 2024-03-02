import { getEnv } from "@app/shared/env";
import Redis from "ioredis";

export const cache = new Redis({
  host: getEnv("CACHE_HOST"),
  port: getEnv("CACHE_PORT"),
});
