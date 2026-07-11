import { getApiUrl, WORKSPACE_SLUG } from "./config";

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface HomeData {
  workspace: { name: string; slug: string; description?: string; logo?: string };
  site?: {
    siteName: string;
    tagline?: string;
    description?: string;
    contactEmail?: string;
    logo?: string;
    aboutExpertise?: string;
    aboutWhyChooseMe?: string;
    linkedinUrl?: string;
    resumePdfUrl?: string;
  };
  socialLinks: Array<{ platform: string; label: string; url: string }>;
  stats: { projects: number; blogs: number; clients: number; skills: number };
  featuredProjects: Array<{
    _id: string;
    title: string;
    slug: string;
    shortDescription?: string;
    thumbnail?: string;
    status?: string;
  }>;
  projects: Array<{ _id: string; title: string; slug: string; shortDescription?: string; thumbnail?: string }>;
  services: Array<{ _id: string; title: string; slug: string; shortDescription?: string; icon?: string }>;
  skills: Array<{ _id: string; name: string; category: string; proficiency: number }>;
  blogs: Array<{ _id: string; title: string; slug: string; excerpt: string; readTimeMinutes?: number; status?: string }>;
  testimonials: Array<{ _id: string; authorName: string; authorRole?: string; content: string; rating: number }>;
  clients: Array<{ _id: string; name: string; logo?: string; industry?: string }>;
  technologies: Array<{ _id: string; name: string; slug: string; icon?: string; category?: string; status?: string }>;
}

export interface SafeUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

async function parseApiResponse<T>(res: Response): Promise<ApiEnvelope<T>> {
  const text = await res.text();
  try {
    return JSON.parse(text) as ApiEnvelope<T>;
  } catch {
    throw new Error(
      res.ok
        ? "Invalid response from API"
        : `API error (${res.status}): ${text.slice(0, 120) || res.statusText}`
    );
  }
}

export async function getHomeData(): Promise<HomeData | null> {
  try {
    const res = await fetch(`${getApiUrl()}/public/${WORKSPACE_SLUG}/home`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await parseApiResponse<HomeData>(res);
    return json.data;
  } catch {
    return null;
  }
}

export interface BootstrapData {
  workspace: { name: string; slug: string; description?: string; logo?: string };
  site?: {
    siteName: string;
    tagline?: string;
    description?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    logo?: string;
    linkedinUrl?: string;
    resumePdfUrl?: string;
  };
  socialLinks: Array<{ platform: string; label: string; url: string }>;
}

export async function getBootstrap(): Promise<BootstrapData | null> {
  try {
    const res = await fetch(`${getApiUrl()}/public/${WORKSPACE_SLUG}/bootstrap`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await parseApiResponse<BootstrapData>(res);
    return json.data;
  } catch {
    return null;
  }
}

async function publicGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${getApiUrl()}/public/${WORKSPACE_SLUG}${path}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await parseApiResponse<T>(res);
    return json.data;
  } catch {
    return null;
  }
}

export function getProjects() {
  return publicGet<{ projects: HomeData["projects"] }>("/projects");
}

export interface TechnologyItem {
  _id: string;
  name: string;
  slug?: string;
  icon?: string;
  color?: string;
}

export interface ProjectDetail {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  coverImage?: string;
  isFeatured?: boolean;
  completedAt?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologyIds?: TechnologyItem[];
}

export function getProjectBySlug(slug: string) {
  return publicGet<{ project: ProjectDetail }>(`/projects/${slug}`);
}

export function getServices() {
  return publicGet<{ services: HomeData["services"] }>("/services");
}

export function getBlogs() {
  return publicGet<{ blogs: HomeData["blogs"] }>("/blog");
}

export interface BlogDetail {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  readTimeMinutes?: number;
  publishedAt?: string;
}

export function getBlogBySlug(slug: string) {
  return publicGet<{ blog: BlogDetail }>(`/blog/${slug}`);
}

export function getTestimonials() {
  return publicGet<{ testimonials: HomeData["testimonials"] }>("/testimonials");
}

export async function login(email: string, password: string) {
  let res: Response;
  try {
    res = await fetch(`${getApiUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Cannot reach API. Make sure the backend is running (npm run dev:api).");
  }

  const json = await parseApiResponse<{ user: SafeUser; accessToken: string }>(res);
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? "Login failed");
  }
  return json.data;
}

export async function getMe(accessToken: string) {
  let res: Response;
  try {
    res = await fetch(`${getApiUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });
  } catch {
    throw new Error("Cannot reach API");
  }

  const json = await parseApiResponse<{ user: SafeUser }>(res);
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? "Unauthorized");
  }
  return json.data.user;
}

export interface AdminPayload {
  workspace: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
  };
  site?: {
    _id: string;
    siteName: string;
    tagline?: string;
    description?: string;
    logo?: string;
    aboutExpertise?: string;
    aboutWhyChooseMe?: string;
    linkedinUrl?: string;
    resumePdfUrl?: string;
  };
  projects: any[];
  services: any[];
  skills: any[];
  blogs: any[];
  technologies: any[];
}

async function adminRequest<T>(
  path: string,
  method: string,
  token: string,
  body?: any
): Promise<T> {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${getApiUrl()}/admin${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const json = await parseApiResponse<T>(res);
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? `${method} request failed`);
  }
  return json.data;
}

export function getAdminData(token: string) {
  return adminRequest<AdminPayload>("/data", "GET", token);
}

export function updateAdminWorkspace(token: string, data: { name: string; description: string; tagline?: string; logo?: string; aboutExpertise?: string; aboutWhyChooseMe?: string; linkedinUrl?: string; resumePdfUrl?: string; }) {
  return adminRequest<any>("/workspace", "PUT", token, data);
}

// Projects
export function createAdminProject(token: string, data: any) {
  return adminRequest<any>("/projects", "POST", token, data);
}
export function updateAdminProject(token: string, id: string, data: any) {
  return adminRequest<any>(`/projects/${id}`, "PUT", token, data);
}
export function deleteAdminProject(token: string, id: string) {
  return adminRequest<any>(`/projects/${id}`, "DELETE", token);
}

// Services
export function createAdminService(token: string, data: any) {
  return adminRequest<any>("/services", "POST", token, data);
}
export function updateAdminService(token: string, id: string, data: any) {
  return adminRequest<any>(`/services/${id}`, "PUT", token, data);
}
export function deleteAdminService(token: string, id: string) {
  return adminRequest<any>(`/services/${id}`, "DELETE", token);
}

// Skills
export function createAdminSkill(token: string, data: any) {
  return adminRequest<any>("/skills", "POST", token, data);
}
export function updateAdminSkill(token: string, id: string, data: any) {
  return adminRequest<any>(`/skills/${id}`, "PUT", token, data);
}
export function deleteAdminSkill(token: string, id: string) {
  return adminRequest<any>(`/skills/${id}`, "DELETE", token);
}

// Blogs
export function createAdminBlog(token: string, data: any) {
  return adminRequest<any>("/blogs", "POST", token, data);
}
export function updateAdminBlog(token: string, id: string, data: any) {
  return adminRequest<any>(`/blogs/${id}`, "PUT", token, data);
}
export function deleteAdminBlog(token: string, id: string) {
  return adminRequest<any>(`/blogs/${id}`, "DELETE", token);
}

// Technologies / Premium Tools
export function createAdminTechnology(token: string, data: any) {
  return adminRequest<any>("/technologies", "POST", token, data);
}
export function updateAdminTechnology(token: string, id: string, data: any) {
  return adminRequest<any>(`/technologies/${id}`, "PUT", token, data);
}
export function deleteAdminTechnology(token: string, id: string) {
  return adminRequest<any>(`/technologies/${id}`, "DELETE", token);
}

// Media Upload
export async function uploadAdminMedia(token: string, file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${getApiUrl()}/media/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${text || res.statusText}`);
  }

  const json = await res.json();
  if (!json.success || !json.data?.media) {
    throw new Error(json.message || "Failed to upload file");
  }

  return { url: json.data.media.secureUrl || json.data.media.url };
}

