import { AsyncLocalStorage } from "async_hooks";

export const ctx = new AsyncLocalStorage();
