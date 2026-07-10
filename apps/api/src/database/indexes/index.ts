import { User } from "../../models/auth/user.model.js";
import { RefreshToken } from "../../models/auth/refreshToken.model.js";
import { UserToken } from "../../models/auth/userToken.model.js";
import { Media } from "../../models/media/media.model.js";
import { Workspace } from "../../models/workspace/workspace.model.js";
import { Category } from "../../models/taxonomy/category.model.js";
import { Tag } from "../../models/taxonomy/tag.model.js";
import { Technology } from "../../models/taxonomy/technology.model.js";
import { Client } from "../../models/content/client.model.js";
import { Skill } from "../../models/content/skill.model.js";
import { Service } from "../../models/content/service.model.js";
import { Project } from "../../models/content/project.model.js";
import { BlogPost } from "../../models/content/blogPost.model.js";
import { Testimonial } from "../../models/content/testimonial.model.js";
import { SocialLink } from "../../models/site/socialLink.model.js";
import { SiteSettings } from "../../models/site/siteSettings.model.js";
import { NavigationMenu } from "../../models/site/navigationMenu.model.js";
import { logger } from "../../utils/logger.util.js";

const models = [
  User,
  RefreshToken,
  UserToken,
  Media,
  Workspace,
  Category,
  Tag,
  Technology,
  Client,
  Skill,
  Service,
  Project,
  BlogPost,
  Testimonial,
  SocialLink,
  SiteSettings,
  NavigationMenu,
];

export async function syncIndexes(): Promise<void> {
  for (const model of models) {
    try {
      await model.syncIndexes();
      logger.debug(`Indexes synced for ${model.modelName}`);
    } catch (error) {
      logger.warn(`Index sync warning for ${model.modelName}`, {
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}
