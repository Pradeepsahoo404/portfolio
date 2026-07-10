import type { Request, Response } from "express";
import { publicService } from "../services/public/public.service.js";
import { ApiResponse, asyncHandler } from "../helpers/index.js";

export class PublicController {
  getBootstrap = asyncHandler(async (req: Request, res: Response) => {
    const workspaceSlug = String(req.params.workspaceSlug);
    const data = await publicService.getBootstrap(workspaceSlug);
    return ApiResponse.success(res, data, "Bootstrap data fetched");
  });

  getHome = asyncHandler(async (req: Request, res: Response) => {
    const workspaceSlug = String(req.params.workspaceSlug);
    const data = await publicService.getHome(workspaceSlug);
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return ApiResponse.success(res, data, "Home data fetched");
  });

  getProjects = asyncHandler(async (req: Request, res: Response) => {
    const data = await publicService.getProjects(String(req.params.workspaceSlug));
    return ApiResponse.success(res, data, "Projects fetched");
  });

  getProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
    const data = await publicService.getProjectBySlug(
      String(req.params.workspaceSlug),
      String(req.params.slug)
    );
    return ApiResponse.success(res, data, "Project fetched");
  });

  getServices = asyncHandler(async (req: Request, res: Response) => {
    const data = await publicService.getServices(String(req.params.workspaceSlug));
    return ApiResponse.success(res, data, "Services fetched");
  });

  getBlogs = asyncHandler(async (req: Request, res: Response) => {
    const data = await publicService.getBlogs(String(req.params.workspaceSlug));
    return ApiResponse.success(res, data, "Blog posts fetched");
  });

  getBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
    const data = await publicService.getBlogBySlug(
      String(req.params.workspaceSlug),
      String(req.params.slug)
    );
    return ApiResponse.success(res, data, "Blog post fetched");
  });

  getTestimonials = asyncHandler(async (req: Request, res: Response) => {
    const data = await publicService.getTestimonials(String(req.params.workspaceSlug));
    return ApiResponse.success(res, data, "Testimonials fetched");
  });
}

export const publicController = new PublicController();