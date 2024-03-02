export const getEnv = (key: string, fallback?: any) => {
  if (key in process.env) {
    return process.env[key];
  }

  if (typeof fallback !== "undefined") {
    return fallback;
  }

  throw ReferenceError(
    `process.env.${key} does not exist and no fallback was given`
  );
};
