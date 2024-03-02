import Pino from "pino";

export default Pino({
  serializers: Pino.stdSerializers,
  level: process.env.LOG_LEVEL || "trace",
});
