import type { Request, Response } from "express";
import { mediaService } from "../services/media/media.service.js";
import { ApiResponse, asyncHandler } from "../helpers/index.js";

function getParamId(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

export class MediaController {
  upload = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return ApiResponse.error(res, "No file uploaded", 400, "BAD_REQUEST");
    }

    const media = await mediaService.upload(req.user!._id, req.file);
    return ApiResponse.created(res, { media }, "File uploaded successfully");
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await mediaService.list(
      req.user!._id.toString(),
      req.query as Record<string, unknown>
    );
    return ApiResponse.success(res, result.data, "Media fetched successfully", 200, result.meta);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamId(req.params.id);
    const media = await mediaService.getById(id, req.user!._id.toString());
    return ApiResponse.success(res, { media }, "Media fetched successfully");
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamId(req.params.id);
    await mediaService.delete(id, req.user!._id.toString());
    return ApiResponse.success(res, null, "Media deleted successfully");
  });
}

export const mediaController = new MediaController();
export default mediaController;
