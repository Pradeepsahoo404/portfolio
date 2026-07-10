/**
 * bulk-status-mongo.mjs
 * Direct MongoDB update — bypasses API rate limits entirely.
 * 
 * - Unlists ALL items in Projects, Services, Skills, BlogPosts, Technologies
 * - Then lists the FIRST 6 of each section (by their existing sort order)
 */

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

  // 1. Find the workspace ID
  const workspace = await db.collection("workspaces").findOne({ slug: WORKSPACE_SLUG, deletedAt: null });
  if (!workspace) {
    console.error(`❌ Workspace "${WORKSPACE_SLUG}" not found`);
    await client.close();
    process.exit(1);
  }
  const workspaceId = workspace._id;
  console.log(`🏢 Workspace: ${workspace.name} (${workspaceId})\n`);

  // Collection configs: { name, collection, sortField, sortOrder }
  const sections = [
    { label: "Projects",      col: "projects",    sort: { order: 1, createdAt: 1 } },
    { label: "Services",      col: "services",    sort: { order: 1, createdAt: 1 } },
    { label: "Skills",        col: "skills",      sort: { order: 1, createdAt: 1 } },
    { label: "Blog Posts",    col: "blogposts",   sort: { publishedAt: -1, createdAt: -1 } },
    { label: "Premium Tools", col: "technologies", sort: { order: 1, createdAt: 1 } },
  ];

  let grandTotal = 0;
  let grandListed = 0;
  let grandUnlisted = 0;

  for (const section of sections) {
    const { label, col, sort } = section;
    const collection = db.collection(col);

    // Fetch all non-deleted items for this workspace, sorted
    const items = await collection
      .find({ workspaceId, deletedAt: null })
      .sort(sort)
      .toArray();

    const total = items.length;
    console.log(`${"─".repeat(55)}`);
    console.log(`📋  ${label.toUpperCase()}  (${total} items)`);
    console.log(`${"─".repeat(55)}`);

    if (total === 0) {
      console.log(`   ⏭  No items — skipping\n`);
      continue;
    }

    // Step A: Unlist ALL items
    const { modifiedCount: unlistCount } = await collection.updateMany(
      { workspaceId, deletedAt: null },
      { $set: { status: "draft" } }
    );
    console.log(`   🔴  Unlisted all ${unlistCount} items`);

    // Step B: List first 6 by their sorted order
    const topSixIds = items.slice(0, 6).map((item) => item._id);
    const { modifiedCount: listCount } = await collection.updateMany(
      { _id: { $in: topSixIds } },
      { $set: { status: "published" } }
    );

    const topSixLabels = items.slice(0, 6).map((item) => item.title || item.name || String(item._id));
    console.log(`   🟢  Listed first ${listCount} items:`);
    topSixLabels.forEach((l) => console.log(`      ✓  ${l}`));

    grandTotal += total;
    grandListed += listCount;
    grandUnlisted += total - listCount;

    console.log(`   ✅  Done: ${listCount} listed  |  ${total - listCount} unlisted\n`);
  }

  await client.close();

  console.log(`${"═".repeat(55)}`);
  console.log(`🎉  ALL DONE — Database updated directly`);
  console.log(`   Total items     : ${grandTotal}`);
  console.log(`   Listed (public) : ${grandListed}`);
  console.log(`   Unlisted (draft): ${grandUnlisted}`);
  console.log(`${"═".repeat(55)}`);
}

main().catch(async (err) => {
  console.error("❌ Script failed:", err.message);
  process.exit(1);
});
