import { Schema, model, Types } from "mongoose";
import { baseSchemaOptions, addSoftDelete, IBaseDocument } from "../base/base.schema.js";
import { workspaceScopedFields } from "../base/workspaceScoped.schema.js";

export interface ITechnology extends IBaseDocument {
  workspaceId: Types.ObjectId;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  website?: string;
  category?: string;
  status: string;
  order: number;
  createdBy?: Types.ObjectId;
}

const technologySchema = new Schema<ITechnology>(
  {
    ...workspaceScopedFields,
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    icon: { type: String },
    color: { type: String },
    website: { type: String },
    category: { type: String, trim: true },
  },
  baseSchemaOptions
);

addSoftDelete(technologySchema);
technologySchema.index({ workspaceId: 1, slug: 1 }, { unique: true });

export const Technology = model<ITechnology>("Technology", technologySchema);
