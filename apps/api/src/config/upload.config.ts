import { env } from "./env.schema.js";

export const uploadConfig = {
  maxFileSize: env.MAX_FILE_SIZE,
  allowedMimeTypes: env.ALLOWED_MIME_TYPES.split(",").map((t) => t.trim()),
} as const;
