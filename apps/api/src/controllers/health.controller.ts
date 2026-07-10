import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ApiResponse, asyncHandler } from "../helpers/index.js";

export class HealthController {
  check = asyncHandler(async (_req: Request, res: Response) => {
    return ApiResponse.success(res, {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }, "Service is healthy");
  });

  dbCheck = asyncHandler(async (_req: Request, res: Response) => {
    const state = mongoose.connection.readyState;
    const statusMap: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    if (state !== 1) {
      return ApiResponse.error(
        res,
        "Database is not connected",
        503,
        "INTERNAL_ERROR"
      );
    }

    await mongoose.connection.db?.admin().ping();

    return ApiResponse.success(res, {
      status: "ok",
      database: statusMap[state],
      timestamp: new Date().toISOString(),
    }, "Database is healthy");
  });
}

export const healthController = new HealthController();
export default healthController;
