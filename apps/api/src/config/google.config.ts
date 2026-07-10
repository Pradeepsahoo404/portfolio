import { env } from "./env.schema.js";

export const googleConfig = {
  clientId: env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
  callbackUrl: env.GOOGLE_CALLBACK_URL ?? "",
  isEnabled: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
} as const;
