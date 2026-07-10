import { Project } from "../models/content/project.model.js";
import { CONTENT_STATUS } from "../constants/content.constants.js";
import { PROJECT_TITLES } from "./data/static.data.js";
import {
  pickRandom,
  pickRandomMany,
  randomDate,
  placeholderImage,
  uniqueSlug,
} from "./utils/helpers.js";
import { SEED_COUNTS } from "./seed.config.js";
import { logger } from "../utils/logger.util.js";
import type { Types } from "mongoose";

interface ProjectSeedInput {
  workspaceId: Types.ObjectId;
  createdBy: Types.ObjectId;
  projectCategoryIds: Types.ObjectId[];
  technologyIds: Types.ObjectId[];
  clientIds: Types.ObjectId[];
  serviceIds: Types.ObjectId[];
}

export async function seedProjects(input: ProjectSeedInput): Promise<Types.ObjectId[]> {
  const { workspaceId, createdBy, projectCategoryIds, technologyIds, clientIds, serviceIds } = input;
  const projectIds: Types.ObjectId[] = [];
  const startDate = new Date("2020-01-01");
  const endDate = new Date();

  for (let i = 0; i < SEED_COUNTS.projects; i++) {
    const title = PROJECT_TITLES[i] ?? `Project ${i + 1}`;
    const slug = uniqueSlug(title, i > PROJECT_TITLES.length - 1 ? i - PROJECT_TITLES.length + 1 : 0);
    const clientId = pickRandom(clientIds);
    const categories = pickRandomMany(projectCategoryIds, 1, 2);
    const technologies = pickRandomMany(technologyIds, 2, 5);
    const services = pickRandomMany(serviceIds, 1, 2);
    const completedAt = randomDate(startDate, endDate);

    const doc = await Project.create({
      workspaceId,
      title,
      slug,
      description: `A comprehensive ${title} built with modern technologies. This project showcases scalable architecture, intuitive UX, and production-grade code quality delivered for ${pickRandom(["startup", "enterprise", "agency"])} clients.`,
      shortDescription: `Modern ${title.split(" ")[0]} solution with full-stack implementation`,
      content: `<h2>Overview</h2><p>${title} was designed to solve real-world business challenges through innovative technology. The platform features responsive design, real-time updates, and seamless third-party integrations.</p><h2>Key Features</h2><ul><li>Scalable microservices architecture</li><li>Real-time data synchronization</li><li>Advanced analytics dashboard</li><li>Mobile-responsive interface</li></ul>`,
      thumbnail: placeholderImage(`${slug}-thumb`, 600, 400),
      coverImage: placeholderImage(`${slug}-cover`, 1200, 630),
      liveUrl: `https://demo.${slug}.app`,
      githubUrl: `https://github.com/alexmorgan/${slug}`,
      categoryIds: categories,
      technologyIds: technologies,
      clientId,
      serviceIds: services,
      isFeatured: i < 8,
      completedAt,
      status: CONTENT_STATUS.PUBLISHED,
      order: i,
      createdBy,
      seoTitle: `${title} | Alex Morgan Studio`,
      seoDescription: `Case study: ${title} - A full-stack project built with ${technologies.length} technologies.`,
    });

    projectIds.push(doc._id);
  }

  logger.info(`Seeded ${SEED_COUNTS.projects} projects`);
  return projectIds;
}
