import type { Request, Response } from "express";
import { Workspace } from "../models/workspace/workspace.model.js";
import { SiteSettings } from "../models/site/siteSettings.model.js";
import { Project } from "../models/content/project.model.js";
import { Service } from "../models/content/service.model.js";
import { Skill } from "../models/content/skill.model.js";
import { BlogPost } from "../models/content/blogPost.model.js";
import { Technology } from "../models/taxonomy/technology.model.js";
import { ApiResponse, asyncHandler } from "../helpers/index.js";
import { NotFoundError } from "../errors/index.js";

export class AdminController {
  // Helper to get workspace of current authenticated user
  private async getWorkspace(req: Request) {
    if (!req.user) throw new NotFoundError("Not logged in");
    const workspace = await Workspace.findOne({ ownerId: req.user._id, deletedAt: null });
    if (!workspace) throw new NotFoundError("Workspace not found");
    return workspace;
  }

  // Get all data for dashboard management
  getData = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const workspaceId = workspace._id;

    const [site, projects, services, skills, blogs, technologies] = await Promise.all([
      SiteSettings.findOne({ workspaceId }).lean(),
      Project.find({ workspaceId, deletedAt: null }).sort({ order: 1 }).lean(),
      Service.find({ workspaceId, deletedAt: null }).sort({ order: 1 }).lean(),
      Skill.find({ workspaceId, deletedAt: null }).sort({ order: 1 }).lean(),
      BlogPost.find({ workspaceId, deletedAt: null }).sort({ publishedAt: -1 }).lean(),
      Technology.find({ workspaceId, deletedAt: null }).sort({ order: 1 }).lean(),
    ]);

    return ApiResponse.success(
      res,
      {
        workspace,
        site,
        projects,
        services,
        skills,
        blogs,
        technologies,
      },
      "Admin data loaded successfully"
    );
  });

  // Update workspace/settings (home / about texts)
  updateWorkspace = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const { name, description, tagline, logo } = req.body;

    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;
    if (logo !== undefined) {
      workspace.logo = logo;
    }
    await workspace.save();

    const site = await SiteSettings.findOne({ workspaceId: workspace._id });
    if (site) {
      site.siteName = name || site.siteName;
      site.tagline = tagline !== undefined ? tagline : site.tagline;
      if (logo !== undefined) {
        site.logo = logo;
      }
      await site.save();
    }

    return ApiResponse.success(res, { workspace, site }, "Workspace updated successfully");
  });

  // Projects CRUD
  createProject = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const project = new Project({
      ...req.body,
      workspaceId: workspace._id,
      slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      status: req.body.status || "published",
    });
    await project.save();
    return ApiResponse.success(res, project, "Project created successfully");
  });

  updateProject = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const project = await Project.findOne({ _id: req.params.id, workspaceId: workspace._id });
    if (!project) throw new NotFoundError("Project not found");

    Object.assign(project, req.body);
    if (req.body.title) {
      project.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    await project.save();
    return ApiResponse.success(res, project, "Project updated successfully");
  });

  deleteProject = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const project = await Project.findOne({ _id: req.params.id, workspaceId: workspace._id });
    if (!project) throw new NotFoundError("Project not found");

    project.deletedAt = new Date();
    await project.save();
    return ApiResponse.success(res, null, "Project deleted successfully");
  });

  // Services CRUD
  createService = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const service = new Service({
      ...req.body,
      workspaceId: workspace._id,
      slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      status: req.body.status || "published",
    });
    await service.save();
    return ApiResponse.success(res, service, "Service created successfully");
  });

  updateService = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const service = await Service.findOne({ _id: req.params.id, workspaceId: workspace._id });
    if (!service) throw new NotFoundError("Service not found");

    Object.assign(service, req.body);
    if (req.body.title) {
      service.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    await service.save();
    return ApiResponse.success(res, service, "Service updated successfully");
  });

  deleteService = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const service = await Service.findOne({ _id: req.params.id, workspaceId: workspace._id });
    if (!service) throw new NotFoundError("Service not found");

    service.deletedAt = new Date();
    await service.save();
    return ApiResponse.success(res, null, "Service deleted successfully");
  });

  // Skills CRUD
  createSkill = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const skill = new Skill({
      ...req.body,
      workspaceId: workspace._id,
      slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      status: req.body.status || "published",
    });
    await skill.save();
    return ApiResponse.success(res, skill, "Skill created successfully");
  });

  updateSkill = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const skill = await Skill.findOne({ _id: req.params.id, workspaceId: workspace._id });
    if (!skill) throw new NotFoundError("Skill not found");

    Object.assign(skill, req.body);
    if (req.body.name) {
      skill.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    await skill.save();
    return ApiResponse.success(res, skill, "Skill updated successfully");
  });

  deleteSkill = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const skill = await Skill.findOne({ _id: req.params.id, workspaceId: workspace._id });
    if (!skill) throw new NotFoundError("Skill not found");

    skill.deletedAt = new Date();
    await skill.save();
    return ApiResponse.success(res, null, "Skill deleted successfully");
  });

  // Blogs CRUD
  createBlog = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const blog = new BlogPost({
      ...req.body,
      workspaceId: workspace._id,
      authorId: req.user?._id,
      slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      status: req.body.status || "published",
      publishedAt: new Date(),
    });
    await blog.save();
    return ApiResponse.success(res, blog, "Blog post created successfully");
  });

  updateBlog = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const blog = await BlogPost.findOne({ _id: req.params.id, workspaceId: workspace._id });
    if (!blog) throw new NotFoundError("Blog post not found");

    Object.assign(blog, req.body);
    if (req.body.title) {
      blog.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    await blog.save();
    return ApiResponse.success(res, blog, "Blog post updated successfully");
  });

  deleteBlog = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const blog = await BlogPost.findOne({ _id: req.params.id, workspaceId: workspace._id });
    if (!blog) throw new NotFoundError("Blog post not found");

    blog.deletedAt = new Date();
    await blog.save();
    return ApiResponse.success(res, null, "Blog post deleted successfully");
  });

  // Technology / Premium Tools CRUD
  createTechnology = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const tech = new Technology({
      ...req.body,
      workspaceId: workspace._id,
      slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      status: req.body.status || "published",
    });
    await tech.save();
    return ApiResponse.success(res, tech, "Technology/Tool created successfully");
  });

  updateTechnology = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const tech = await Technology.findOne({ _id: req.params.id, workspaceId: workspace._id });
    if (!tech) throw new NotFoundError("Technology/Tool not found");

    Object.assign(tech, req.body);
    if (req.body.name) {
      tech.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    await tech.save();
    return ApiResponse.success(res, tech, "Technology/Tool updated successfully");
  });

  deleteTechnology = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await this.getWorkspace(req);
    const tech = await Technology.findOne({ _id: req.params.id, workspaceId: workspace._id });
    if (!tech) throw new NotFoundError("Technology/Tool not found");

    tech.deletedAt = new Date();
    await tech.save();
    return ApiResponse.success(res, null, "Technology/Tool deleted successfully");
  });
}

export const adminController = new AdminController();
