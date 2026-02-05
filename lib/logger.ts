import pino from "pino";

const isEdge = process.env.EDGE_ENV === "true";
const isProduction = process.env.NODE_ENV === "production";

const Logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    !isEdge && !isProduction
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "sys:standard",
          },
        }
      : undefined,

  // formatter
  formatters: {
    level: (label: string) => ({ level: label.toUpperCase() }),
  },
  timestamp: () => new Date().toISOString(),
});

export default Logger;
