/**
 * bulk-status-mongoose.ts
 * Run via: npx tsx bulk-status-mongoose.ts
 */
import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://autodhundigital_db_user:0p68lY7gbyKHCJuV@cluster0.qo9s5eo.mongodb.net/portfolio";
const WORKSPACE_SLUG = "pradeep-sahoo-studio";

const WorkspaceSchema = new mongoose.Schema({}, { strict: false });
const ProjectSchema = new mongoose.Schema({}, { strict: false });
const ServiceSchema = new mongoose.Schema({}, { strict: false });
const SkillSchema = new mongoose.Schema({}, { strict: false });
const BlogPostSchema = new mongoose.Schema({}, { strict: false });
const TechnologySchema = new mongoose.Schema({}, { strict: false });

const Workspace = mongoose.models.Workspace || mongoose.model("Workspace", WorkspaceSchema, "workspaces");
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema, "projects");
const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema, "services");
const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema, "skills");
const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema, "blogposts");
const Technology = mongoose.models.Technology || mongoose.model("Technology", TechnologySchema, "technologies");

async function main() {
  console.log("Connecting to database using Mongoose...");
  await mongoose.connect(MONGO_URI);
  console.log("Connected successfully!\n");

  const workspace = (await Workspace.findOne({ slug: WORKSPACE_SLUG, deletedAt: null }).lean()) as any;
  if (!workspace) {
    console.error(`Workspace not found: ${WORKSPACE_SLUG}`);
    process.exit(1);
  }
  const workspaceId = workspace._id;
  console.log(`Workspace: ${workspace.name} (${workspaceId})\n`);

  const sections = [
    { label: "Projects", model: Project, sort: { order: 1, createdAt: 1 } },
    { label: "Services", model: Service, sort: { order: 1, createdAt: 1 } },
    { label: "Skills", model: Skill, sort: { order: 1, createdAt: 1 } },
    { label: "Blog Posts", model: BlogPost, sort: { publishedAt: -1, createdAt: -1 } },
    { label: "Premium Tools", model: Technology, sort: { order: 1, createdAt: 1 } },
  ];

  for (const s of sections) {
    const items = await s.model.find({ workspaceId, deletedAt: null }).sort(s.sort as any).lean();
    console.log(`📋  ${s.label}: ${items.length} total items`);
    if (items.length === 0) continue;

    // Unlist all
    await s.model.updateMany({ workspaceId, deletedAt: null }, { $set: { status: "draft" } });
    console.log(`   🔴 Unlisted all items`);

    // List top 6
    const topSixIds = items.slice(0, 6).map(i => i._id);
    await s.model.updateMany({ _id: { $in: topSixIds } }, { $set: { status: "published" } });
    console.log(`   🟢 Listed top 6 items:`);
    items.slice(0, 6).forEach(i => console.log(`      - ${i.title || i.name || i._id}`));
  }

  await mongoose.disconnect();
  console.log("\nDone!");
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
