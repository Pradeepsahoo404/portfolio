import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.util.js";
import { userRepository } from "../repositories/auth/user.repository.js";
import { UnauthorizedError } from "../errors/index.js";
import { ROLE_PERMISSIONS } from "../constants/permissions.constants.js";
import type { Role } from "../constants/roles.constants.js";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Access token not provided");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    const user = await userRepository.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedError("User not found or inactive");
    }

    req.user = user;
    req.permissions = ROLE_PERMISSIONS[user.role as Role] ?? [];

    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);
    const user = await userRepository.findById(payload.sub);

    if (user?.isActive) {
      req.user = user;
      req.permissions = ROLE_PERMISSIONS[user.role as Role] ?? [];
    }

    next();
  } catch {
    next();
  }
};

export default authenticate;
