import { Workspace } from "../models/workspace/workspace.model.js";
import { WORKSPACE_TYPES } from "../constants/content.constants.js";
import { seedConfig } from "./seed.config.js";
import { logger } from "../utils/logger.util.js";
import type { Types } from "mongoose";

export async function seedWorkspace(ownerId: Types.ObjectId): Promise<Types.ObjectId> {
  let workspace = await Workspace.findOne({ slug: seedConfig.workspaceSlug, deletedAt: null });

  if (!workspace) {
    workspace = await Workspace.create({
      name: seedConfig.workspaceName,
      slug: seedConfig.workspaceSlug,
      type: WORKSPACE_TYPES.AGENCY,
      ownerId,
      description:
        "Award-winning full-stack development studio specializing in SaaS platforms, portfolio websites, and enterprise web applications.",
      logo: "https://ui-avatars.com/api/?name=Alex+Morgan+Studio&background=18181b&color=fff&size=256",
      isActive: true,
    });
    logger.info(`Created workspace: ${seedConfig.workspaceName}`);
  } else {
    logger.info(`Workspace exists: ${seedConfig.workspaceName}`);
  }

  return workspace._id;
}
