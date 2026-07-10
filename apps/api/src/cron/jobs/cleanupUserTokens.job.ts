import { userTokenRepository } from "../../repositories/auth/userToken.repository.js";
import { logger } from "../../utils/logger.util.js";

export async function cleanupUserTokensJob(): Promise<void> {
  const deleted = await userTokenRepository.deleteExpiredTokens();
  logger.info(`Cleaned up ${deleted} expired/used user tokens`);
}
