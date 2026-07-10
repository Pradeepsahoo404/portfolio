import { env } from "./env.schema.js";

export const databaseConfig = {
  uri: env.MONGODB_URI,
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
} as const;
