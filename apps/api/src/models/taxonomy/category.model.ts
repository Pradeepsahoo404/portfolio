import { Schema, model, Document, Types } from "mongoose";
import {
  CATEGORY_ENTITY_TYPES,
  type CategoryEntityType,
} from "../../constants/content.constants.js";
import { baseSchemaOptions, addSoftDelete } from "../base/base.schema.js";
import { workspaceScopedFields } from "../base/workspaceScoped.schema.js";

export interface ICategory extends Document {
  workspaceId: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  entityType: CategoryEntityType;
  color?: string;
  status: string;
  order: number;
  createdBy?: Types.ObjectId;
}

const categorySchema = new Schema<ICategory>(
  {
    ...workspaceScopedFields,
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    entityType: {
      type: String,
      enum: Object.values(CATEGORY_ENTITY_TYPES),
      required: true,
      index: true,
    },
    color: { type: String },
  },
  baseSchemaOptions
);

addSoftDelete(categorySchema);
categorySchema.index({ workspaceId: 1, slug: 1, entityType: 1 }, { unique: true });

export const Category = model<ICategory>("Category", categorySchema);
