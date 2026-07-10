import { env } from "./env.schema.js";

export const appConfig = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  apiPrefix: env.API_PREFIX,
  appName: env.APP_NAME,
  appUrl: env.APP_URL,
  clientUrl: env.CLIENT_URL,
  isProduction: env.NODE_ENV === "production",
  isDevelopment: env.NODE_ENV === "development",
  isTest: env.NODE_ENV === "test",
} as const;
