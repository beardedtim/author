import Pino from "pino";
import config from "./config";

export default Pino({
  serializers: Pino.stdSerializers,
  level: config.general.logLevel,
  name: config.general.name,
  mixin: () => ({
    version: config.general.version,
  }),
});
