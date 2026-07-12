import type { Request, Response } from "express";
import { authService } from "../services/auth/auth.service.js";
import { ApiResponse, asyncHandler } from "../helpers/index.js";
import { HTTP_STATUS } from "../constants/httpStatus.constants.js";
import { googleConfig } from "../config/index.js";

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return ApiResponse.created(res, result, "Registration successful. Please verify your email.");
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body, req, res);
    return ApiResponse.success(res, result, "Login successful");
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.refresh(req, res);
    return ApiResponse.success(res, result, "Token refreshed successfully");
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req, res);
    return ApiResponse.success(res, null, "Logged out successfully");
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getMe(req.user!._id.toString());
    return ApiResponse.success(res, { user }, "User profile fetched");
  });



  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.changePassword(req.user!._id.toString(), req.body);
    return ApiResponse.success(res, result, result.message);
  });

  googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.googleLogin(req.body, req, res);
    return ApiResponse.success(res, result, "Google login successful");
  });

  googleAuthUrl = asyncHandler(async (_req: Request, res: Response) => {
    const result = authService.getGoogleAuthUrl();
    return ApiResponse.success(res, result, "Google auth URL generated");
  });

  googleCallback = asyncHandler(async (req: Request, res: Response) => {
    const code = req.query.code as string;
    if (!code) {
      return ApiResponse.error(
        res,
        "Authorization code is required",
        HTTP_STATUS.BAD_REQUEST,
        "BAD_REQUEST"
      );
    }
    const result = await authService.googleCallback(code, req, res);
    return ApiResponse.success(res, result, "Google authentication successful");
  });

  googleStatus = asyncHandler(async (_req: Request, res: Response) => {
    return ApiResponse.success(
      res,
      { enabled: googleConfig.isEnabled },
      "Google auth status"
    );
  });
}

export const authController = new AuthController();
export default authController;
