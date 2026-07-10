import { Schema, model, Types } from "mongoose";
import { baseSchemaOptions, addSoftDelete, IBaseDocument } from "../base/base.schema.js";
import { workspaceScopedFields } from "../base/workspaceScoped.schema.js";

export interface IProject extends IBaseDocument {
  workspaceId: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  content?: string;
  thumbnail?: string;
  coverImage?: string;
  liveUrl?: string;
  githubUrl?: string;
  categoryIds: Types.ObjectId[];
  technologyIds: Types.ObjectId[];
  clientId?: Types.ObjectId;
  serviceIds: Types.ObjectId[];
  isFeatured: boolean;
  completedAt?: Date;
  status: string;
  order: number;
  createdBy?: Types.ObjectId;
  seoTitle?: string;
  seoDescription?: string;
}

const projectSchema = new Schema<IProject>(
  {
    ...workspaceScopedFields,
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true },
    content: { type: String },
    thumbnail: { type: String },
    coverImage: { type: String },
    liveUrl: { type: String },
    githubUrl: { type: String },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    technologyIds: [{ type: Schema.Types.ObjectId, ref: "Technology" }],
    clientId: { type: Schema.Types.ObjectId, ref: "Client" },
    serviceIds: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    isFeatured: { type: Boolean, default: false },
    completedAt: { type: Date },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  baseSchemaOptions
);

addSoftDelete(projectSchema);
projectSchema.index({ workspaceId: 1, slug: 1 }, { unique: true });
projectSchema.index({ workspaceId: 1, isFeatured: 1 });
projectSchema.index({ workspaceId: 1, clientId: 1 });
projectSchema.index({ categoryIds: 1 });
projectSchema.index({ technologyIds: 1 });

export const Project = model<IProject>("Project", projectSchema);
