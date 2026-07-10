import { Testimonial } from "../models/content/testimonial.model.js";
import { CONTENT_STATUS } from "../constants/content.constants.js";
import { TESTIMONIAL_AUTHORS, TESTIMONIAL_CONTENT } from "./data/static.data.js";
import { avatarImage } from "./utils/helpers.js";
import { SEED_COUNTS } from "./seed.config.js";
import { logger } from "../utils/logger.util.js";
import type { Types } from "mongoose";

interface TestimonialSeedInput {
  workspaceId: Types.ObjectId;
  createdBy: Types.ObjectId;
  clientIds: Types.ObjectId[];
  projectIds: Types.ObjectId[];
}

export async function seedTestimonials(input: TestimonialSeedInput): Promise<void> {
  const { workspaceId, createdBy, clientIds, projectIds } = input;

  for (let i = 0; i < SEED_COUNTS.testimonials; i++) {
    const author = TESTIMONIAL_AUTHORS[i];
    await Testimonial.create({
      workspaceId,
      clientId: clientIds[i],
      projectId: projectIds[i],
      authorName: author.name,
      authorRole: author.role,
      authorAvatar: avatarImage(author.name),
      content: TESTIMONIAL_CONTENT[i],
      rating: 5,
      status: CONTENT_STATUS.PUBLISHED,
      order: i,
      createdBy,
    });
  }

  logger.info(`Seeded ${SEED_COUNTS.testimonials} testimonials`);
}
