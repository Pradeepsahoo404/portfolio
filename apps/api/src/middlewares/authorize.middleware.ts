import type { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/index.js";
import type { Permission } from "../constants/permissions.constants.js";
import type { Role } from "../constants/roles.constants.js";
import { ROLE_HIERARCHY } from "../constants/roles.constants.js";

export const authorize =
  (...requiredPermissions: Permission[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ForbiddenError("Authentication required"));
    }

    const userPermissions = req.permissions ?? [];

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return next(new ForbiddenError("Insufficient permissions"));
    }

    next();
  };

export const requireRole =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ForbiddenError("Authentication required"));
    }

    if (!roles.includes(req.user.role as Role)) {
      return next(new ForbiddenError("Insufficient role privileges"));
    }

    next();
  };

export const requireMinRole =
  (minRole: Role) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ForbiddenError("Authentication required"));
    }

    const userLevel = ROLE_HIERARCHY[req.user.role as Role] ?? 0;
    const requiredLevel = ROLE_HIERARCHY[minRole] ?? 0;

    if (userLevel < requiredLevel) {
      return next(new ForbiddenError("Insufficient role privileges"));
    }

    next();
  };

export default authorize;
