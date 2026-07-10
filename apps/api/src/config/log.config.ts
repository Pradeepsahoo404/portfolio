import { env } from "./env.schema.js";

export const logConfig = {
  level: env.LOG_LEVEL,
  dir: env.LOG_DIR,
} as const;
