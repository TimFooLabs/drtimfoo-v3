import pino from "pino";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  browser: {
    asObject: true,
  },
  // Disable worker threads to avoid thread-stream compatibility issues with Bun
  // This eliminates the "Cannot find module '/ROOT/node_modules/thread-stream/lib/worker.js'" errors
  transport: undefined,
});
