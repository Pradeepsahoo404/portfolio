import mongoose from "mongoose";
import { logger } from "../../utils/logger.util.js";

const COLLECTIONS = [
  "navigationmenus",
  "sitesettings",
  "sociallinks",
  "testimonials",
  "blogposts",
  "projects",
  "services",
  "skills",
  "clients",
  "technologies",
  "tags",
  "categories",
  "workspaces",
  "media",
  "usertokens",
  "refreshtokens",
  "users",
];

export async function clearDatabase(): Promise<void> {
  const db = mongoose.connection.db;
  if (!db) return;

  for (const collection of COLLECTIONS) {
    try {
      const exists = await db.listCollections({ name: collection }).hasNext();
      if (exists) {
        await db.collection(collection).deleteMany({});
        logger.info(`Cleared collection: ${collection}`);
      }
    } catch {
      logger.warn(`Could not clear collection: ${collection}`);
    }
  }
}
