import { env } from "./env.schema.js";

export const rateLimitConfig = {
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  authMax: env.AUTH_RATE_LIMIT_MAX,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
} as const;
