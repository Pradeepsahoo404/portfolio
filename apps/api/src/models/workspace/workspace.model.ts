import { Schema, model, Types } from "mongoose";
import { WORKSPACE_TYPES, type WorkspaceType } from "../../constants/content.constants.js";
import { baseSchemaOptions, addSoftDelete, IBaseDocument } from "../base/base.schema.js";

export interface IWorkspace extends IBaseDocument {
  name: string;
  slug: string;
  type: WorkspaceType;
  ownerId: Types.ObjectId;
  description?: string;
  logo?: string;
  isActive: boolean;
}

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: { type: String, enum: Object.values(WORKSPACE_TYPES), default: WORKSPACE_TYPES.PERSONAL },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    description: { type: String, trim: true },
    logo: { type: String },
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions
);

addSoftDelete(workspaceSchema);

export const Workspace = model<IWorkspace>("Workspace", workspaceSchema);
