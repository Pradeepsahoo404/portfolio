import { Schema, model, Document, Types } from "mongoose";
import { SOCIAL_PLATFORMS, type SocialPlatform } from "../../constants/content.constants.js";
import { baseSchemaOptions, addSoftDelete } from "../base/base.schema.js";
import { workspaceScopedFields } from "../base/workspaceScoped.schema.js";

export interface ISocialLink extends Document {
  workspaceId: Types.ObjectId;
  platform: SocialPlatform;
  label: string;
  url: string;
  icon?: string;
  status: string;
  order: number;
  createdBy?: Types.ObjectId;
}

const socialLinkSchema = new Schema<ISocialLink>(
  {
    ...workspaceScopedFields,
    platform: { type: String, enum: Object.values(SOCIAL_PLATFORMS), required: true },
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String },
  },
  baseSchemaOptions
);

addSoftDelete(socialLinkSchema);
socialLinkSchema.index({ workspaceId: 1, platform: 1 }, { unique: true });

export const SocialLink = model<ISocialLink>("SocialLink", socialLinkSchema);
