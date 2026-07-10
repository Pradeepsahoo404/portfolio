import { User } from "../../models/auth/user.model.js";
import { Media } from "../../models/media/media.model.js";
import { logger } from "../../utils/logger.util.js";

const RETENTION_DAYS = 30;

export async function cleanupSoftDeletedJob(): Promise<void> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  const [users, media] = await Promise.all([
    User.deleteMany({ deletedAt: { $lt: cutoff } }),
    Media.deleteMany({ deletedAt: { $lt: cutoff } }),
  ]);

  logger.info(
    `Permanently deleted ${users.deletedCount} users and ${media.deletedCount} media records`
  );
}
