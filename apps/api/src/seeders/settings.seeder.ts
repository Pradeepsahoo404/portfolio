import { SiteSettings } from "../models/site/siteSettings.model.js";
import { seedConfig } from "./seed.config.js";
import { logger } from "../utils/logger.util.js";
import type { Types } from "mongoose";

export async function seedSettings(workspaceId: Types.ObjectId): Promise<void> {
  await SiteSettings.create({
    workspaceId,
    siteName: seedConfig.workspaceName,
    tagline: "Building Digital Experiences That Matter",
    description:
      "Alex Morgan Studio is a full-stack development agency crafting premium portfolio websites, SaaS platforms, and enterprise web applications for clients worldwide.",
    logo: "https://ui-avatars.com/api/?name=Alex+Morgan+Studio&background=18181b&color=fff&size=256",
    favicon: "https://ui-avatars.com/api/?name=AM&background=3b82f6&color=fff&size=64",
    contactEmail: "hello@alexmorgan.dev",
    contactPhone: "+1 (555) 123-4567",
    address: "San Francisco, CA, United States",
    timezone: "America/Los_Angeles",
    language: "en",
    maintenanceMode: false,
    seo: {
      metaTitle: "Alex Morgan Studio | Full-Stack Developer & Agency",
      metaDescription:
        "Award-winning full-stack developer and agency specializing in React, Next.js, Node.js, and MongoDB. View 50+ projects and read expert development articles.",
      ogImage: "https://picsum.photos/seed/alex-morgan-og/1200/630",
      keywords: [
        "full-stack developer",
        "web development agency",
        "react developer",
        "next.js",
        "portfolio",
        "saas development",
      ],
      googleAnalyticsId: "G-XXXXXXXXXX",
    },
    theme: {
      primaryColor: "#18181b",
      secondaryColor: "#71717a",
      accentColor: "#3b82f6",
      fontHeading: "Inter",
      fontBody: "Inter",
      darkMode: true,
    },
  });

  logger.info("Seeded site settings");
}
