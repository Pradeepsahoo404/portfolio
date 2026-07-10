export const PERMISSIONS = {
  // User management
  USER_READ: "user:read",
  USER_CREATE: "user:create",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",

  // Media
  MEDIA_READ: "media:read",
  MEDIA_UPLOAD: "media:upload",
  MEDIA_DELETE: "media:delete",

  // System
  SYSTEM_ADMIN: "system:admin",
  AUDIT_READ: "audit:read",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

import { ROLES, type Role } from "./roles.constants.js";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.MEDIA_READ,
    PERMISSIONS.MEDIA_UPLOAD,
    PERMISSIONS.MEDIA_DELETE,
    PERMISSIONS.AUDIT_READ,
  ],
  [ROLES.EDITOR]: [
    PERMISSIONS.MEDIA_READ,
    PERMISSIONS.MEDIA_UPLOAD,
    PERMISSIONS.MEDIA_DELETE,
  ],
  [ROLES.VIEWER]: [PERMISSIONS.MEDIA_READ, PERMISSIONS.USER_READ],
  [ROLES.USER]: [PERMISSIONS.MEDIA_READ],
};
