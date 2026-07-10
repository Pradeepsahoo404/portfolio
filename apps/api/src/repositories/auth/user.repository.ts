import { User, type IUser } from "../../models/auth/user.model.js";
import { BaseRepository } from "../base/base.repository.js";

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email: email.toLowerCase(), deletedAt: null }).select("+password");
  }

  async findByEmailPublic(email: string): Promise<IUser | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return this.findOne({ googleId });
  }

  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const filter: Record<string, unknown> = { email: email.toLowerCase(), deletedAt: null };
    if (excludeId) filter._id = { $ne: excludeId };
    const count = await this.model.countDocuments(filter);
    return count > 0;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.model.updateOne({ _id: userId }, { lastLoginAt: new Date() });
  }
}

export const userRepository = new UserRepository();
export default userRepository;
