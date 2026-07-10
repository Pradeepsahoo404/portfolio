import { Schema, model, Types } from "mongoose";
import { baseSchemaOptions, addSoftDelete, IBaseDocument } from "../base/base.schema.js";
import { workspaceScopedFields } from "../base/workspaceScoped.schema.js";

export interface ISkill extends IBaseDocument {
  workspaceId: Types.ObjectId;
  name: string;
  slug: string;
  category: string;
  proficiency: number;
  yearsOfExperience?: number;
  icon?: string;
  status: string;
  order: number;
  createdBy?: Types.ObjectId;
}

const skillSchema = new Schema<ISkill>(
  {
    ...workspaceScopedFields,
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    proficiency: { type: Number, min: 0, max: 100, default: 75 },
    yearsOfExperience: { type: Number, min: 0 },
    icon: { type: String },
  },
  baseSchemaOptions
);

addSoftDelete(skillSchema);
skillSchema.index({ workspaceId: 1, slug: 1 }, { unique: true });
skillSchema.index({ workspaceId: 1, category: 1 });

export const Skill = model<ISkill>("Skill", skillSchema);
