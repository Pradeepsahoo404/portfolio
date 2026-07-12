import "./loadEnv.js";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .optional()
    .transform((v) => {
      const p = Number(v);
      return p > 0 ? p : 5001; // fallback to 5001 if empty or 0
    }),
  API_PREFIX: z.string().default("/api/v1"),
  APP_NAME: z.string().default("Portfolio API"),
  APP_URL: z.string().url(),
  CLIENT_URL: z.string().url(),

  MONGODB_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  COOKIE_SECRET: z.string().min(32),
  COOKIE_SECURE: z
    .string()
    .transform((v) => v === "true")
    .default("false"),
  COOKIE_SAME_SITE: z.enum(["strict", "lax", "none"]).default("lax"),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_FOLDER: z.string().default("portfolio"),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().url().optional(),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().default(10),

  MAX_FILE_SIZE: z.coerce.number().default(5242880),
  ALLOWED_MIME_TYPES: z
    .string()
    .default("image/jpeg,image/png,image/webp,image/gif,application/pdf"),

  CRON_ENABLED: z
    .string()
    .transform((v) => v === "true")
    .default("true"),
  CRON_TIMEZONE: z.string().default("UTC"),

  LOG_LEVEL: z
    .enum(["error", "warn", "info", "http", "debug"])
    .default("debug"),
  LOG_DIR: z.string().default("logs"),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.errors
      .map((e) => `  ${e.path.join(".")}: ${e.message}`)
      .join("\n");
    console.error(`Environment validation failed:\n${formatted}`);
    process.exit(1);
  }

  return result.data;
}

export const env = parseEnv();
