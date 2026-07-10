import { RefreshToken, type IRefreshToken } from "../../models/auth/refreshToken.model.js";
import { BaseRepository } from "../base/base.repository.js";
import type { Types } from "mongoose";

class RefreshTokenRepository extends BaseRepository<IRefreshToken> {
  constructor() {
    super(RefreshToken);
  }

  async createToken(data: Partial<IRefreshToken>): Promise<IRefreshToken> {
    return this.create(data as IRefreshToken);
  }

  async findValidToken(userId: string, tokenId: string): Promise<IRefreshToken | null> {
    return this.model.findOne({
      userId,
      _id: tokenId,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });
  }

  async revokeToken(tokenId: string): Promise<void> {
    await this.model.updateOne({ _id: tokenId }, { isRevoked: true });
  }

  async revokeAllUserTokens(userId: string | Types.ObjectId): Promise<void> {
    await this.model.updateMany({ userId, isRevoked: false }, { isRevoked: true });
  }

  async deleteExpiredTokens(): Promise<number> {
    const result = await this.model.deleteMany({
      $or: [{ expiresAt: { $lt: new Date() } }, { isRevoked: true }],
    });
    return result.deletedCount;
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
export default refreshTokenRepository;
