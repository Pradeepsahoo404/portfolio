import type { CorsOptions } from "cors";
import { appConfig } from "./app.config.js";

const devOrigins = [
  appConfig.clientUrl,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export const corsConfig: CorsOptions = {
  origin(origin, callback) {
    if (!origin || devOrigins.includes(origin) || appConfig.isDevelopment) {
      callback(null, true);
      return;
    }
    callback(null, devOrigins.includes(origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
  exposedHeaders: ["X-Request-Id"],
  maxAge: 86400,
};
