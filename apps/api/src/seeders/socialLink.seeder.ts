import { SocialLink } from "../models/site/socialLink.model.js";
import { CONTENT_STATUS } from "../constants/content.constants.js";
import { SOCIAL_LINKS } from "./data/static.data.js";
import { logger } from "../utils/logger.util.js";
import type { Types } from "mongoose";

export async function seedSocialLinks(
  workspaceId: Types.ObjectId,
  createdBy: Types.ObjectId
): Promise<void> {
  for (let i = 0; i < SOCIAL_LINKS.length; i++) {
    const link = SOCIAL_LINKS[i];
    await SocialLink.create({
      workspaceId,
      platform: link.platform,
      label: link.label,
      url: link.url,
      icon: link.platform,
      status: CONTENT_STATUS.PUBLISHED,
      order: i,
      createdBy,
    });
  }

  logger.info(`Seeded ${SOCIAL_LINKS.length} social links`);
}
