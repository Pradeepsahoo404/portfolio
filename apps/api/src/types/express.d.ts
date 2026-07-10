import type { IUser } from "../models/auth/user.model.js";
import type { Role } from "../constants/roles.constants.js";
import type { Permission } from "../constants/permissions.constants.js";

declare global {
  namespace Express {
    interface Locals {
      requestId: string;
    }

    interface Request {
      user?: IUser;
      permissions?: Permission[];
    }
  }
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

export {};
