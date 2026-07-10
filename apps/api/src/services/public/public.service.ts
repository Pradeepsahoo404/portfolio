import { Workspace } from "../../models/workspace/workspace.model.js";
import { SiteSettings } from "../../models/site/siteSettings.model.js";
import { SocialLink } from "../../models/site/socialLink.model.js";
import { NavigationMenu } from "../../models/site/navigationMenu.model.js";
import { Project } from "../../models/content/project.model.js";
import { Service } from "../../models/content/service.model.js";
import { BlogPost } from "../../models/content/blogPost.model.js";
import { Skill } from "../../models/content/skill.model.js";
import { Testimonial } from "../../models/content/testimonial.model.js";
import { Client } from "../../models/content/client.model.js";
import { Technology } from "../../models/taxonomy/technology.model.js";
import { CONTENT_STATUS } from "../../constants/content.constants.js";
import { NotFoundError } from "../../errors/index.js";

const published = { status: CONTENT_STATUS.PUBLISHED, deletedAt: null };

export class PublicService {
  async getWorkspaceBySlug(slug: string) {
    const workspace = await Workspace.findOne({ slug, deletedAt: null, isActive: true }).lean();
    if (!workspace) throw new NotFoundError("Workspace not found");
    return workspace;
  }

  async getBootstrap(workspaceSlug: string) {
    const workspace = await this.getWorkspaceBySlug(workspaceSlug);
    const workspaceId = workspace._id;

    const [site, socialLinks, menus] = await Promise.all([
      SiteSettings.findOne({ workspaceId }).lean(),
      SocialLink.find({ workspaceId, ...published }).sort({ order: 1 }).lean(),
      NavigationMenu.find({ workspaceId, isActive: true }).lean(),
    ]);

    return {
      workspace: {
        name: workspace.name,
        slug: workspace.slug,
        type: workspace.type,
        description: workspace.description,
        logo: workspace.logo,
      },
      site,
      socialLinks,
      menus: menus.map((menu) => ({
        name: menu.name,
        location: menu.location,
        items: menu.items,
      })),
    };
  }

  async getHome(workspaceSlug: string) {
    const workspace = await this.getWorkspaceBySlug(workspaceSlug);
    const workspaceId = workspace._id;

    const [
      site,
      socialLinks,
      featuredProjects,
      projects,
      services,
      skills,
      blogs,
      testimonials,
      clients,
      technologies,
      projectCount,
      blogCount,
      clientCount,
    ] = await Promise.all([
      SiteSettings.findOne({ workspaceId }).lean(),
      SocialLink.find({ workspaceId, ...published }).sort({ order: 1 }).lean(),
      Project.find({ workspaceId, ...published, isFeatured: true })
        .sort({ order: 1 })
        .limit(6)
        .select("title slug shortDescription thumbnail coverImage technologyIds")
        .lean(),
      Project.find({ workspaceId, ...published })
        .sort({ order: 1 })
        .limit(50)
        .select("title slug shortDescription thumbnail")
        .lean(),
      Service.find({ workspaceId, ...published }).sort({ order: 1 }).limit(50).lean(),
      Skill.find({ workspaceId, ...published }).sort({ order: 1 }).limit(100).lean(),
      BlogPost.find({ workspaceId, ...published })
        .sort({ publishedAt: -1 })
        .limit(4) // Let's keep blog posts at 4 latest as requested before
        .select("title slug excerpt coverImage readTimeMinutes publishedAt")
        .lean(),
      Testimonial.find({ workspaceId, ...published }).sort({ order: 1 }).limit(20).lean(),
      Client.find({ workspaceId, ...published }).sort({ order: 1 }).limit(50).select("name logo industry").lean(),
      Technology.find({ workspaceId, ...published }).sort({ order: 1 }).limit(100).lean(),
      Project.countDocuments({ workspaceId, ...published }),
      BlogPost.countDocuments({ workspaceId, ...published }),
      Client.countDocuments({ workspaceId, ...published }),
    ]);

    return {
      workspace: {
        name: workspace.name,
        slug: workspace.slug,
        description: workspace.description,
        logo: workspace.logo,
      },
      site,
      socialLinks,
      stats: {
        projects: projectCount,
        blogs: blogCount,
        clients: clientCount,
        skills: 100,
      },
      featuredProjects,
      projects,
      services,
      skills,
      blogs,
      testimonials,
      clients,
      technologies,
    };
  }

  async getProjects(workspaceSlug: string) {
    const workspace = await this.getWorkspaceBySlug(workspaceSlug);
    const projects = await Project.find({ workspaceId: workspace._id, ...published })
      .sort({ order: 1 })
      .select("title slug shortDescription thumbnail coverImage isFeatured completedAt")
      .lean();
    return { projects };
  }

  async getProjectBySlug(workspaceSlug: string, projectSlug: string) {
    const workspace = await this.getWorkspaceBySlug(workspaceSlug);
    const project = await Project.findOne({
      workspaceId: workspace._id,
      slug: projectSlug,
      ...published,
    })
      .select("title slug shortDescription description content thumbnail coverImage isFeatured completedAt technologyIds liveUrl githubUrl categoryIds")
      .populate("technologyIds", "name slug icon color")
      .lean();
    if (!project) throw new NotFoundError("Project not found");
    return { project };
  }

  async getServices(workspaceSlug: string) {
    const workspace = await this.getWorkspaceBySlug(workspaceSlug);
    const services = await Service.find({ workspaceId: workspace._id, ...published })
      .sort({ order: 1 })
      .lean();
    return { services };
  }

  async getBlogs(workspaceSlug: string) {
    const workspace = await this.getWorkspaceBySlug(workspaceSlug);
    const blogs = await BlogPost.find({ workspaceId: workspace._id, ...published })
      .sort({ publishedAt: -1 })
      .select("title slug excerpt coverImage readTimeMinutes publishedAt")
      .lean();
    return { blogs };
  }

  async getBlogBySlug(workspaceSlug: string, blogSlug: string) {
    const workspace = await this.getWorkspaceBySlug(workspaceSlug);
    const blog = await BlogPost.findOne({
      workspaceId: workspace._id,
      slug: blogSlug,
      ...published,
    })
      .select("title slug excerpt content coverImage readTimeMinutes publishedAt")
      .lean();
    if (!blog) throw new NotFoundError("Blog post not found");
    return { blog };
  }

  async getTestimonials(workspaceSlug: string) {
    const workspace = await this.getWorkspaceBySlug(workspaceSlug);
    const testimonials = await Testimonial.find({ workspaceId: workspace._id, ...published })
      .sort({ order: 1 })
      .lean();
    return { testimonials };
  }
}

export const publicService = new PublicService();
