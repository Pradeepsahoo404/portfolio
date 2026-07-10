import { connectDatabase, disconnectDatabase } from "../database/connection.js";
import { syncIndexes } from "../database/indexes/index.js";
import { seedConfig } from "./seed.config.js";
import { clearDatabase } from "./utils/clearDatabase.js";
import { seedUsers } from "./user.seeder.js";
import { seedWorkspace } from "./workspace.seeder.js";
import { seedTaxonomy } from "./taxonomy.seeder.js";
import { seedSkills } from "./skill.seeder.js";
import { seedServices } from "./service.seeder.js";
import { seedProjects } from "./project.seeder.js";
import { seedBlogs } from "./blog.seeder.js";
import { seedTestimonials } from "./testimonial.seeder.js";
import { seedSocialLinks } from "./socialLink.seeder.js";
import { seedSettings } from "./settings.seeder.js";
import { seedMenus } from "./menu.seeder.js";
import { logger } from "../utils/logger.util.js";

export async function runSeeders(): Promise<void> {
  logger.info("=== Starting database seeders ===");

  await connectDatabase();

  if (seedConfig.clearBeforeSeed) {
    logger.info("Clearing existing data...");
    await clearDatabase();
  }

  await syncIndexes();

  const adminUserId = await seedUsers();
  const workspaceId = await seedWorkspace(adminUserId);

  const taxonomy = await seedTaxonomy(workspaceId, adminUserId);

  await seedSkills(workspaceId, adminUserId);

  const serviceIds = await seedServices(workspaceId, adminUserId);

  const projectIds = await seedProjects({
    workspaceId,
    createdBy: adminUserId,
    projectCategoryIds: taxonomy.projectCategoryIds,
    technologyIds: taxonomy.technologyIds,
    clientIds: taxonomy.clientIds,
    serviceIds,
  });

  await seedBlogs({
    workspaceId,
    authorId: adminUserId,
    createdBy: adminUserId,
    blogCategoryIds: taxonomy.blogCategoryIds,
    tagIds: taxonomy.tagIds,
  });

  await seedTestimonials({
    workspaceId,
    createdBy: adminUserId,
    clientIds: taxonomy.clientIds,
    projectIds,
  });

  await seedSocialLinks(workspaceId, adminUserId);
  await seedSettings(workspaceId);
  await seedMenus(workspaceId, taxonomy.projectCategoryIds, taxonomy.blogCategoryIds);

  logger.info("=== Database seeding completed successfully ===");
  logger.info("Summary:");
  logger.info("  - 1 Admin User (admin@portfolio.com / Admin@123)");
  logger.info("  - 1 Workspace (alex-morgan-studio)");
  logger.info("  - 50 Projects (linked to clients, categories, technologies, services)");
  logger.info("  - 30 Blog Posts (linked to author, categories, tags)");
  logger.info("  - 100 Skills");
  logger.info("  - 20 Services");
  logger.info("  - 10 Testimonials (linked to clients & projects)");
  logger.info("  - 20 Technologies");
  logger.info("  - 20 Clients");
  logger.info("  - 6 Social Links");
  logger.info("  - 1 Site Settings");
  logger.info("  - 3 Navigation Menus");
}

runSeeders()
  .then(async () => {
    await disconnectDatabase();
    process.exit(0);
  })
  .catch(async (error) => {
    logger.error("Seeding failed", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    await disconnectDatabase();
    process.exit(1);
  });
