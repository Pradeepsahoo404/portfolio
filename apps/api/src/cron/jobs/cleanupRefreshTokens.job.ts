import { refreshTokenRepository } from "../../repositories/auth/refreshToken.repository.js";
import { logger } from "../../utils/logger.util.js";

export async function cleanupRefreshTokensJob(): Promise<void> {
  const deleted = await refreshTokenRepository.deleteExpiredTokens();
  logger.info(`Cleaned up ${deleted} expired/revoked refresh tokens`);
}
