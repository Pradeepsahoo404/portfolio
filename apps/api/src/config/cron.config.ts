import { env } from "./env.schema.js";

export const cronConfig = {
  enabled: env.CRON_ENABLED,
  timezone: env.CRON_TIMEZONE,
} as const;
