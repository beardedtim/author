import { getEnv } from "./env";

const config = {
  general: {
    name: getEnv("SERVICE_NAME", "author"),
    port: getEnv("PORT", 5000),
    logLevel: getEnv("LOG_LEVEL", "trace"),
  },
  database: {
    host: getEnv("DB_HOST"),
    port: getEnv("DB_PORT"),
    password: getEnv("DB_PASS"),
    user: getEnv("DB_USER"),
    name: getEnv("DB_NAME"),
  },
  cache: {
    host: getEnv("CACHE_HOST"),
    port: getEnv("CACHE_PORT"),
  },
  graph: {
    username: getEnv("GRAPH_USER"),
    password: getEnv("GRAPH_PASS"),
    host: getEnv("GRAPH_HOST"),
    port: getEnv("GRAPH_PORT"),
  },
};

export default config;
