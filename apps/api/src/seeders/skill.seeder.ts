import { Skill } from "../models/content/skill.model.js";
import { CONTENT_STATUS } from "../constants/content.constants.js";
import { SKILLS_BY_CATEGORY, SKILL_CATEGORIES } from "./data/static.data.js";
import { slugify, randomInt } from "./utils/helpers.js";
import { SEED_COUNTS } from "./seed.config.js";
import { logger } from "../utils/logger.util.js";
import type { Types } from "mongoose";

export async function seedSkills(
  workspaceId: Types.ObjectId,
  createdBy: Types.ObjectId
): Promise<void> {
  const allSkills: Array<{ name: string; category: string }> = [];

  for (const category of SKILL_CATEGORIES) {
    const skills = SKILLS_BY_CATEGORY[category] ?? [];
    for (const name of skills) {
      allSkills.push({ name, category });
    }
  }

  let extra = 1;
  while (allSkills.length < SEED_COUNTS.skills) {
    const category = SKILL_CATEGORIES[allSkills.length % SKILL_CATEGORIES.length];
    allSkills.push({ name: `${category} Specialization ${extra++}`, category });
  }

  const toSeed = allSkills.slice(0, SEED_COUNTS.skills);
  const slugCounts = new Map<string, number>();

  for (let i = 0; i < toSeed.length; i++) {
    const { name, category } = toSeed[i];
    const baseSlug = slugify(name);
    const count = slugCounts.get(baseSlug) ?? 0;
    slugCounts.set(baseSlug, count + 1);
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count}`;

    await Skill.create({
      workspaceId,
      name,
      slug,
      category,
      proficiency: randomInt(60, 98),
      yearsOfExperience: randomInt(1, 12),
      status: CONTENT_STATUS.PUBLISHED,
      order: i,
      createdBy,
    });
  }

  logger.info(`Seeded ${SEED_COUNTS.skills} skills`);
}
