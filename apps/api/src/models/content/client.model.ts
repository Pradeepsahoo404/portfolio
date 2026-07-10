import { Schema, model, Document, Types } from "mongoose";
import { baseSchemaOptions, addSoftDelete } from "../base/base.schema.js";
import { workspaceScopedFields } from "../base/workspaceScoped.schema.js";

export interface IClient extends Document {
  workspaceId: Types.ObjectId;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  industry?: string;
  description?: string;
  status: string;
  order: number;
  createdBy?: Types.ObjectId;
}

const clientSchema = new Schema<IClient>(
  {
    ...workspaceScopedFields,
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    logo: { type: String },
    website: { type: String },
    industry: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  baseSchemaOptions
);

addSoftDelete(clientSchema);
clientSchema.index({ workspaceId: 1, slug: 1 }, { unique: true });

export const Client = model<IClient>("Client", clientSchema);
