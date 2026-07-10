import { Schema, model, Types } from "mongoose";
import { baseSchemaOptions, addSoftDelete, IBaseDocument } from "../base/base.schema.js";
import { workspaceScopedFields } from "../base/workspaceScoped.schema.js";

export interface IService extends IBaseDocument {
  workspaceId: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  icon?: string;
  price?: string;
  features: string[];
  status: string;
  order: number;
  createdBy?: Types.ObjectId;
}

const serviceSchema = new Schema<IService>(
  {
    ...workspaceScopedFields,
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true },
    icon: { type: String },
    price: { type: String },
    features: [{ type: String }],
  },
  baseSchemaOptions
);

addSoftDelete(serviceSchema);
serviceSchema.index({ workspaceId: 1, slug: 1 }, { unique: true });

export const Service = model<IService>("Service", serviceSchema);
