import { userRepository } from "../repositories/auth/user.repository.js";
import { hashPassword } from "../utils/hash.util.js";
import { ROLES } from "../constants/roles.constants.js";
import { AUTH_PROVIDERS } from "../constants/auth.constants.js";
import { seedConfig } from "./seed.config.js";
import { logger } from "../utils/logger.util.js";
import type { Types } from "mongoose";

export async function seedUsers(): Promise<Types.ObjectId> {
  let user = await userRepository.findByEmailPublic(seedConfig.adminEmail);

  if (!user) {
    const hashedPassword = await hashPassword("Admin@123");
    user = await userRepository.create({
      firstName: "Alex",
      lastName: "Morgan",
      email: seedConfig.adminEmail,
      password: hashedPassword,
      role: ROLES.SUPER_ADMIN,
      authProvider: AUTH_PROVIDERS.LOCAL,
      isEmailVerified: true,
      isActive: true,
      avatar: "https://i.pravatar.cc/300?u=alexmorgan",
    } as never);
    logger.info(`Created admin user: ${seedConfig.adminEmail}`);
  } else {
    const hashedPassword = await hashPassword("Admin@123");
    await userRepository.update(user._id.toString(), {
      $set: {
        password: hashedPassword,
        isEmailVerified: true,
        isActive: true,
        role: ROLES.SUPER_ADMIN,
      },
    } as never);
    logger.info(`Admin user exists — password reset: ${seedConfig.adminEmail}`);
  }

  return user._id;
}
