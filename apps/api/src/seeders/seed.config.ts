export const SEED_COUNTS = {
  projects: 50,
  blogs: 30,
  skills: 100,
  services: 20,
  testimonials: 10,
  technologies: 20,
  clients: 20,
  projectCategories: 8,
  blogCategories: 6,
  tags: 15,
} as const;

export const seedConfig = {
  clearBeforeSeed: process.env.SEED_CLEAR !== "false",
  workspaceSlug: "pradeep-sahoo-studio",
  workspaceName: "Pradeep Sahoo Studio",
  adminEmail: "admin@portfolio.com",
} as const;
