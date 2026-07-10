import { mongo } from "mongoose";
const { MongoClient } = mongo;

import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "apps/api/.env") });

const MONGO_URI = process.env.MONGODB_URI;
const WORKSPACE_SLUG = process.env.WORKSPACE_SLUG || "pradeep-sahoo-studio";

async function main() {
  console.log("🔌 Connecting to MongoDB...");
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db("portfolio");
  console.log("✅ Connected!\n");

  const workspace = await db.collection("workspaces").findOne({ slug: WORKSPACE_SLUG, deletedAt: null });
  if (!workspace) {
    console.error(`❌ Workspace "${WORKSPACE_SLUG}" not found`);
    await client.close();
    process.exit(1);
  }
  const workspaceId = workspace._id;
  
  const socialLinksCollection = db.collection("sociallinks");

  // Delete all existing links
  await socialLinksCollection.deleteMany({ workspaceId });
  console.log("🗑️ Deleted old social links");

  // Insert the new links
  const links = [
    { workspaceId, platform: "github", label: "GitHub", url: "https://github.com/Pradeepsahoo404", status: "published", order: 1, deletedAt: null, createdAt: new Date(), updatedAt: new Date() },
    { workspaceId, platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/pradeep-sahoo-web-developer/", status: "published", order: 2, deletedAt: null, createdAt: new Date(), updatedAt: new Date() },
    { workspaceId, platform: "email", label: "Email", url: "mailto:sahoopradeep034@gmail.com", status: "published", order: 3, deletedAt: null, createdAt: new Date(), updatedAt: new Date() },
    { workspaceId, platform: "phone", label: "Phone", url: "tel:+919328288710", status: "published", order: 4, deletedAt: null, createdAt: new Date(), updatedAt: new Date() },
    { workspaceId, platform: "whatsapp", label: "WhatsApp", url: "https://wa.me/919328288710", status: "published", order: 5, deletedAt: null, createdAt: new Date(), updatedAt: new Date() },
  ];

  await socialLinksCollection.insertMany(links);
  console.log("✅ Inserted new social links");

  await client.close();
}

main().catch(console.error);
