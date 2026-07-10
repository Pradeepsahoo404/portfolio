import { Schema, model, Document, Types } from "mongoose";
import { baseSchemaOptions, addSoftDelete } from "../base/base.schema.js";
import { workspaceScopedFields } from "../base/workspaceScoped.schema.js";

export interface ITag extends Document {
  workspaceId: Types.ObjectId;
  name: string;
  slug: string;
  status: string;
  order: number;
  createdBy?: Types.ObjectId;
}

const tagSchema = new Schema<ITag>(
  {
    ...workspaceScopedFields,
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
  },
  baseSchemaOptions
);

addSoftDelete(tagSchema);
tagSchema.index({ workspaceId: 1, slug: 1 }, { unique: true });

export const Tag = model<ITag>("Tag", tagSchema);
