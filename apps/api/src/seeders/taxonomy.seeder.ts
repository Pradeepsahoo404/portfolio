import { Category } from "../models/taxonomy/category.model.js";
import { Tag } from "../models/taxonomy/tag.model.js";
import { Technology } from "../models/taxonomy/technology.model.js";
import { Client } from "../models/content/client.model.js";
import { CATEGORY_ENTITY_TYPES, CONTENT_STATUS } from "../constants/content.constants.js";
import {
  PROJECT_CATEGORIES,
  BLOG_CATEGORIES,
  BLOG_TAGS,
  TECHNOLOGIES,
  CLIENTS,
} from "./data/static.data.js";
import { slugify, logoImage } from "./utils/helpers.js";
import { logger } from "../utils/logger.util.js";
import type { Types } from "mongoose";
import type { SeedContext } from "./utils/helpers.js";

export async function seedTaxonomy(
  workspaceId: Types.ObjectId,
  createdBy: Types.ObjectId
): Promise<Pick<SeedContext, "projectCategoryIds" | "blogCategoryIds" | "tagIds" | "technologyIds" | "clientIds">> {
  const projectCategoryIds: Types.ObjectId[] = [];
  for (let i = 0; i < PROJECT_CATEGORIES.length; i++) {
    const cat = PROJECT_CATEGORIES[i];
    const doc = await Category.create({
      workspaceId,
      name: cat.name,
      slug: slugify(cat.name),
      description: `${cat.name} projects and case studies`,
      entityType: CATEGORY_ENTITY_TYPES.PROJECT,
      color: cat.color,
      status: CONTENT_STATUS.PUBLISHED,
      order: i,
      createdBy,
    });
    projectCategoryIds.push(doc._id);
  }

  const blogCategoryIds: Types.ObjectId[] = [];
  for (let i = 0; i < BLOG_CATEGORIES.length; i++) {
    const cat = BLOG_CATEGORIES[i];
    const doc = await Category.create({
      workspaceId,
      name: cat.name,
      slug: slugify(cat.name),
      description: `Articles about ${cat.name.toLowerCase()}`,
      entityType: CATEGORY_ENTITY_TYPES.BLOG,
      color: cat.color,
      status: CONTENT_STATUS.PUBLISHED,
      order: i,
      createdBy,
    });
    blogCategoryIds.push(doc._id);
  }

  const tagIds: Types.ObjectId[] = [];
  for (let i = 0; i < BLOG_TAGS.length; i++) {
    const name = BLOG_TAGS[i];
    const doc = await Tag.create({
      workspaceId,
      name,
      slug: slugify(name),
      status: CONTENT_STATUS.PUBLISHED,
      order: i,
      createdBy,
    });
    tagIds.push(doc._id);
  }

  const technologyIds: Types.ObjectId[] = [];
  for (let i = 0; i < TECHNOLOGIES.length; i++) {
    const tech = TECHNOLOGIES[i];
    const doc = await Technology.create({
      workspaceId,
      name: tech.name,
      slug: slugify(tech.name),
      category: tech.category,
      color: tech.color,
      website: tech.website,
      icon: `https://cdn.simpleicons.org/${slugify(tech.name).replace(/-/g, "")}`,
      status: CONTENT_STATUS.PUBLISHED,
      order: i,
      createdBy,
    });
    technologyIds.push(doc._id);
  }

  const clientIds: Types.ObjectId[] = [];
  for (let i = 0; i < CLIENTS.length; i++) {
    const client = CLIENTS[i];
    const doc = await Client.create({
      workspaceId,
      name: client.name,
      slug: slugify(client.name),
      industry: client.industry,
      website: `https://${slugify(client.name)}.com`,
      logo: logoImage(client.name),
      description: `${client.name} is a leading company in the ${client.industry} industry.`,
      status: CONTENT_STATUS.PUBLISHED,
      order: i,
      createdBy,
    });
    clientIds.push(doc._id);
  }

  logger.info(
    `Seeded taxonomy: ${projectCategoryIds.length} project categories, ${blogCategoryIds.length} blog categories, ${tagIds.length} tags, ${technologyIds.length} technologies, ${clientIds.length} clients`
  );

  return { projectCategoryIds, blogCategoryIds, tagIds, technologyIds, clientIds };
}
