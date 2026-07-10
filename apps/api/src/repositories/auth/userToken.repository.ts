import { UserToken, type IUserToken } from "../../models/auth/userToken.model.js";
import { BaseRepository } from "../base/base.repository.js";
import type { TokenType } from "../../constants/auth.constants.js";

class UserTokenRepository extends BaseRepository<IUserToken> {
  constructor() {
    super(UserToken);
  }

  async createToken(data: Partial<IUserToken>): Promise<IUserToken> {
    return this.create(data as IUserToken);
  }

  async findValidToken(userId: string, type: TokenType): Promise<IUserToken | null> {
    return this.model.findOne({
      userId,
      type,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });
  }

  async markAsUsed(tokenId: string): Promise<void> {
    await this.model.updateOne({ _id: tokenId }, { isUsed: true });
  }

  async invalidateUserTokens(userId: string, type: TokenType): Promise<void> {
    await this.model.updateMany({ userId, type, isUsed: false }, { isUsed: true });
  }

  async findActiveTokens(type: TokenType): Promise<IUserToken[]> {
    return this.model.find({
      type,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });
  }

  async deleteExpiredTokens(): Promise<number> {
    const result = await this.model.deleteMany({
      $or: [{ expiresAt: { $lt: new Date() } }, { isUsed: true }],
    });
    return result.deletedCount;
  }
}

export const userTokenRepository = new UserTokenRepository();
export default userTokenRepository;
