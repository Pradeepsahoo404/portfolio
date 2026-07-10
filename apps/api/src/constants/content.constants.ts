export const CONTENT_STATUS = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export type ContentStatus = (typeof CONTENT_STATUS)[keyof typeof CONTENT_STATUS];

export const WORKSPACE_TYPES = {
  PERSONAL: "personal",
  AGENCY: "agency",
} as const;

export type WorkspaceType = (typeof WORKSPACE_TYPES)[keyof typeof WORKSPACE_TYPES];

export const CATEGORY_ENTITY_TYPES = {
  PROJECT: "project",
  BLOG: "blog",
} as const;

export type CategoryEntityType =
  (typeof CATEGORY_ENTITY_TYPES)[keyof typeof CATEGORY_ENTITY_TYPES];

export const SOCIAL_PLATFORMS = {
  GITHUB: "github",
  LINKEDIN: "linkedin",
  TWITTER: "twitter",
  INSTAGRAM: "instagram",
  DRIBBBLE: "dribbble",
  BEHANCE: "behance",
  YOUTUBE: "youtube",
  FACEBOOK: "facebook",
  WEBSITE: "website",
  EMAIL: "email",
  WHATSAPP: "whatsapp",
} as const;

export type SocialPlatform =
  (typeof SOCIAL_PLATFORMS)[keyof typeof SOCIAL_PLATFORMS];

export const MENU_LOCATIONS = {
  HEADER: "header",
  FOOTER: "footer",
  SIDEBAR: "sidebar",
} as const;

export type MenuLocation = (typeof MENU_LOCATIONS)[keyof typeof MENU_LOCATIONS];
