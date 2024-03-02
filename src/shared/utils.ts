import { randomUUID } from "crypto";
import Log from "@app/shared/log";

export const uuid = () => randomUUID({ disableEntropyCache: true });

export const allowedToFail = async (prom: () => Promise<any>, msg?: string) => {
  const message = msg
    ? `Failsafe :: ${msg}`
    : "Failsafe :: we have allowed a promise to fail";

  try {
    await prom();
  } catch (err) {
    Log.debug(message);
  }
};

export const allowedToFailWhen = async (
  prom: () => Promise<any>,
  pred: (err: unknown) => boolean,
  msg?: string
) => {
  const message = msg
    ? `Failsafe :: ${msg}`
    : "Failsafe :: we have allowed a promise to fail";

  try {
    await prom();
  } catch (err) {
    if (pred(err)) {
      Log.debug(message);
    } else {
      throw err;
    }
  }
};

export const startTimer = () => {
  const start = process.hrtime();

  return {
    timeElapsed: () => {
      const end = process.hrtime(start);

      return end[0] * 1000 + end[1] / 1000000;
    },
  };
};
