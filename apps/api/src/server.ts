import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./database/connection.js";
import { startCronJobs } from "./cron/index.js";
import { syncIndexes } from "./database/indexes/index.js";
import { verifyEmailConnection } from "./emails/mailer.js";
import { appConfig } from "./config/index.js";
import { logger } from "./utils/logger.util.js";

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await syncIndexes();
  await verifyEmailConnection();

  const app = createApp();

  startCronJobs();

  const server = app.listen(appConfig.port, () => {
    logger.info(
      `${appConfig.appName} running on port ${appConfig.port} [${appConfig.nodeEnv}]`
    );
    logger.info(`API: ${appConfig.appUrl}${appConfig.apiPrefix}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      logger.error(
        `Port ${appConfig.port} is already in use. Stop the other API process or change PORT in apps/api/.env`
      );
    } else {
      logger.error("Server failed to start", { error });
    }
    process.exit(1);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info("Server closed");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection", { reason });
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception", { error: error.message, stack: error.stack });
    process.exit(1);
  });
}

bootstrap().catch((error) => {
  logger.error("Failed to start server", { error });
  process.exit(1);
});