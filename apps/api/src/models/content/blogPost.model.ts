import { Schema, model, Types } from "mongoose";
import { baseSchemaOptions, addSoftDelete, IBaseDocument } from "../base/base.schema.js";
import { workspaceScopedFields } from "../base/workspaceScoped.schema.js";

export interface IBlogPost extends IBaseDocument {
  workspaceId: Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  authorId: Types.ObjectId;
  categoryIds: Types.ObjectId[];
  tagIds: Types.ObjectId[];
  readTimeMinutes: number;
  isFeatured: boolean;
  publishedAt?: Date;
  status: string;
  order: number;
  createdBy?: Types.ObjectId;
  seoTitle?: string;
  seoDescription?: string;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    ...workspaceScopedFields,
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    tagIds: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    readTimeMinutes: { type: Number, default: 5 },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  baseSchemaOptions
);

addSoftDelete(blogPostSchema);
blogPostSchema.index({ workspaceId: 1, slug: 1 }, { unique: true });
blogPostSchema.index({ workspaceId: 1, authorId: 1 });
blogPostSchema.index({ categoryIds: 1 });
blogPostSchema.index({ tagIds: 1 });
blogPostSchema.index({ publishedAt: -1 });

export const BlogPost = model<IBlogPost>("BlogPost", blogPostSchema);
