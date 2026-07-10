import { NavigationMenu } from "../models/site/navigationMenu.model.js";
import { MENU_LOCATIONS } from "../constants/content.constants.js";
import { PROJECT_CATEGORIES, BLOG_CATEGORIES } from "./data/static.data.js";
import { logger } from "../utils/logger.util.js";
import type { Types } from "mongoose";

export async function seedMenus(
  workspaceId: Types.ObjectId,
  projectCategoryIds: Types.ObjectId[],
  blogCategoryIds: Types.ObjectId[]
): Promise<void> {
  await NavigationMenu.create({
    workspaceId,
    name: "Main Header",
    location: MENU_LOCATIONS.HEADER,
    isActive: true,
    items: [
      { label: "Home", url: "/", slug: "home", openInNewTab: false, order: 0 },
      { label: "About", url: "/about", slug: "about", openInNewTab: false, order: 1 },
      {
        label: "Projects",
        url: "/projects",
        slug: "projects",
        categoryId: projectCategoryIds[0],
        openInNewTab: false,
        order: 2,
        children: projectCategoryIds.slice(0, 4).map((catId, i) => ({
          label: PROJECT_CATEGORIES[i]?.name ?? `Category ${i + 1}`,
          categoryId: catId,
          url: `/projects?category=${catId}`,
          openInNewTab: false,
          order: i,
        })),
      },
      {
        label: "Blog",
        url: "/blog",
        slug: "blog",
        categoryId: blogCategoryIds[0],
        openInNewTab: false,
        order: 3,
        children: blogCategoryIds.map((catId, i) => ({
          label: BLOG_CATEGORIES[i]?.name ?? `Blog ${i + 1}`,
          categoryId: catId,
          url: `/blog?category=${catId}`,
          openInNewTab: false,
          order: i,
        })),
      },
      { label: "Services", url: "/services", slug: "services", openInNewTab: false, order: 4 },
      { label: "Contact", url: "/contact", slug: "contact", openInNewTab: false, order: 5 },
    ],
  });

  await NavigationMenu.create({
    workspaceId,
    name: "Footer Navigation",
    location: MENU_LOCATIONS.FOOTER,
    isActive: true,
    items: [
      { label: "Privacy Policy", url: "/privacy", slug: "privacy", openInNewTab: false, order: 0 },
      { label: "Terms of Service", url: "/terms", slug: "terms", openInNewTab: false, order: 1 },
      { label: "GitHub", url: "https://github.com/alexmorgan", openInNewTab: true, order: 2 },
      { label: "LinkedIn", url: "https://linkedin.com/in/alexmorgan", openInNewTab: true, order: 3 },
      { label: "RSS Feed", url: "/blog/rss", slug: "rss", openInNewTab: false, order: 4 },
    ],
  });

  await NavigationMenu.create({
    workspaceId,
    name: "Sidebar Quick Links",
    location: MENU_LOCATIONS.SIDEBAR,
    isActive: true,
    items: [
      { label: "Featured Projects", url: "/projects?featured=true", slug: "featured", openInNewTab: false, order: 0 },
      { label: "Latest Blog", url: "/blog", slug: "blog-latest", openInNewTab: false, order: 1 },
      { label: "Download Resume", url: "/resume", slug: "resume", openInNewTab: false, order: 2 },
      { label: "Hire Me", url: "/contact?type=hire", slug: "hire", openInNewTab: false, order: 3 },
    ],
  });

  logger.info("Seeded 3 navigation menus (header, footer, sidebar)");
}
