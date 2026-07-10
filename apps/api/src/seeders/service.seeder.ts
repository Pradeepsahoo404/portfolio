import { Service } from "../models/content/service.model.js";
import { CONTENT_STATUS } from "../constants/content.constants.js";
import { SERVICES } from "./data/static.data.js";
import { slugify } from "./utils/helpers.js";
import { logger } from "../utils/logger.util.js";
import type { Types } from "mongoose";

export async function seedServices(
  workspaceId: Types.ObjectId,
  createdBy: Types.ObjectId
): Promise<Types.ObjectId[]> {
  const serviceIds: Types.ObjectId[] = [];

  for (let i = 0; i < SERVICES.length; i++) {
    const svc = SERVICES[i];
    const doc = await Service.create({
      workspaceId,
      title: svc.title,
      slug: slugify(svc.title),
      description: `${svc.shortDescription}. We deliver high-quality solutions tailored to your business needs, combining technical excellence with creative design.`,
      shortDescription: svc.shortDescription,
      icon: "briefcase",
      price: i < 5 ? "From $5,000" : i < 10 ? "From $3,000" : "Custom Quote",
      features: svc.features,
      status: CONTENT_STATUS.PUBLISHED,
      order: i,
      createdBy,
    });
    serviceIds.push(doc._id);
  }

  logger.info(`Seeded ${serviceIds.length} services`);
  return serviceIds;
}
