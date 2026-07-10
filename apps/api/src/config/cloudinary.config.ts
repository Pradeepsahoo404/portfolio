import { env } from "./env.schema.js";

export const cloudinaryConfig = {
  cloudName: env.CLOUDINARY_CLOUD_NAME,
  apiKey: env.CLOUDINARY_API_KEY,
  apiSecret: env.CLOUDINARY_API_SECRET,
  folder: env.CLOUDINARY_FOLDER,
} as const;
