import Pino from "pino";
import config from "./config";
import { ctx } from "./ctx";

export default Pino({
  serializers: Pino.stdSerializers,
  level: config.general.logLevel,
  name: config.general.name,
  mixin: () => {
    const state = ctx.getStore() as any;

    return {
      version: config.general.version,
      ...state,
    };
  },
});
