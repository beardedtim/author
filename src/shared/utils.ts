import { randomUUID } from "crypto";
import Log from "@app/shared/log";
import { ctx } from "./ctx";

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

export const inContext = <T extends (...args: any[]) => any>(
  method: T,
  name: string
): ReturnType<T> => {
  const rootContext = ctx.getStore() as { span: string };

  const state = {
    trace: `trace::${uuid()}`,
    span: `span::${uuid()}`,
    name,
    parent_span: rootContext?.span,
  };

  return ctx.run(state, async () => {
    const timer = startTimer();
    try {
      const result = await (method as any)();

      Log.trace({ ran: timer.timeElapsed(), name });

      return result;
    } catch (err) {
      Log.trace({ err, ran: timer.timeElapsed(), name });

      throw err;
    }
  }) as ReturnType<T>;
};

export const runInContext = <T = (...args: any[]) => any>(
  method: T,
  name: string
): T => {
  return ((...args: any[]) =>
    inContext(() => (method as any)(...args), name)) as any;
};
