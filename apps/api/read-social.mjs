import { mongo } from "mongoose";
const { MongoClient } = mongo;
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "apps/api/.env") });
const MONGO_URI = process.env.MONGODB_URI;
const WORKSPACE_SLUG = process.env.WORKSPACE_SLUG || "pradeep-sahoo-studio";

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db("portfolio");
  const workspace = await db.collection("workspaces").findOne({ slug: WORKSPACE_SLUG });
  const links = await db.collection("sociallinks").find({ workspaceId: workspace._id }).toArray();
  console.log(links.map(l => ({ platform: l.platform, url: l.url })));
  await client.close();
}
main().catch(console.error);
