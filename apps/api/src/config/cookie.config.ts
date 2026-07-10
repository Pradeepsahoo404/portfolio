import { env } from "./env.schema.js";

export const cookieConfig = {
  secret: env.COOKIE_SECRET,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAME_SITE as "strict" | "lax" | "none",
  refreshTokenName: "refreshToken",
  httpOnly: true,
  path: "/",
} as const;
