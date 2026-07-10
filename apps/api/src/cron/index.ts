import cron from "node-cron";
import { cronConfig } from "../config/index.js";
import { logger } from "../utils/logger.util.js";
import { cleanupRefreshTokensJob } from "./jobs/cleanupRefreshTokens.job.js";
import { cleanupUserTokensJob } from "./jobs/cleanupUserTokens.job.js";
import { cleanupSoftDeletedJob } from "./jobs/cleanupSoftDeleted.job.js";

interface CronJobDefinition {
  name: string;
  schedule: string;
  handler: () => Promise<void>;
  enabled?: boolean;
}

const jobs: CronJobDefinition[] = [
  {
    name: "cleanupRefreshTokens",
    schedule: "0 2 * * *",
    handler: cleanupRefreshTokensJob,
  },
  {
    name: "cleanupUserTokens",
    schedule: "0 3 * * *",
    handler: cleanupUserTokensJob,
  },
  {
    name: "cleanupSoftDeleted",
    schedule: "0 4 * * 0",
    handler: cleanupSoftDeletedJob,
  },
];

export function startCronJobs(): void {
  if (!cronConfig.enabled) {
    logger.info("Cron jobs are disabled");
    return;
  }

  for (const job of jobs) {
    if (job.enabled === false) continue;

    cron.schedule(
      job.schedule,
      async () => {
        logger.info(`Running cron job: ${job.name}`);
        try {
          await job.handler();
          logger.info(`Cron job completed: ${job.name}`);
        } catch (error) {
          logger.error(`Cron job failed: ${job.name}`, { error });
        }
      },
      { timezone: cronConfig.timezone }
    );

    logger.info(`Scheduled cron job: ${job.name} (${job.schedule})`);
  }
}

export default startCronJobs;
