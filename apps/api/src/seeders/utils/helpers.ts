import type { Types } from "mongoose";

export interface SeedContext {
  adminUserId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  projectCategoryIds: Types.ObjectId[];
  blogCategoryIds: Types.ObjectId[];
  tagIds: Types.ObjectId[];
  technologyIds: Types.ObjectId[];
  clientIds: Types.ObjectId[];
  serviceIds: Types.ObjectId[];
  projectIds: Types.ObjectId[];
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickRandomMany<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.min(arr.length, min + Math.floor(Math.random() * (max - min + 1)));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueSlug(base: string, index: number): string {
  return index === 0 ? slugify(base) : `${slugify(base)}-${index}`;
}

export function placeholderImage(seed: string, width = 800, height = 600): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

export function avatarImage(seed: string): string {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;
}

export function logoImage(seed: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&background=18181b&color=fff&size=128`;
}
