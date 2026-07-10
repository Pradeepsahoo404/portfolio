import mongoose from "mongoose";
import { databaseConfig } from "../config/index.js";
import { logger } from "../utils/logger.util.js";

export async function connectDatabase(): Promise<void> {
  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => {
    logger.info("MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });

  await mongoose.connect(databaseConfig.uri, databaseConfig.options);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected gracefully");
}

export { mongoose };
