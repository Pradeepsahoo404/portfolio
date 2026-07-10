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

  // 1. Update workspace logo
  await db.collection("workspaces").updateOne(
    { _id: workspaceId },
    { $set: { logo: "/logo.jpg" } }
  );
  console.log("✅ Workspace logo updated to /logo.jpg");

  // 2. Update site settings logo
  await db.collection("sitesettings").updateOne(
    { workspaceId },
    { $set: { logo: "/logo.jpg" } }
  );
  console.log("✅ Site settings logo updated to /logo.jpg");

  await client.close();
  console.log("🎉 Database updated successfully!");
}

main().catch(async (err) => {
  console.error("❌ Script failed:", err.message);
  process.exit(1);
});
