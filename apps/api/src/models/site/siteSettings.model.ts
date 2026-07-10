import { Schema, model, Document, Types } from "mongoose";
import { baseSchemaOptions } from "../base/base.schema.js";

export interface ISiteSettings extends Document {
  workspaceId: Types.ObjectId;
  siteName: string;
  tagline?: string;
  description?: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  timezone?: string;
  language?: string;
  maintenanceMode: boolean;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    keywords?: string[];
    googleAnalyticsId?: string;
  };
  theme: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontHeading?: string;
    fontBody?: string;
    darkMode?: boolean;
  };
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      unique: true,
      index: true,
    },
    siteName: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    description: { type: String },
    logo: { type: String },
    favicon: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    address: { type: String },
    timezone: { type: String, default: "UTC" },
    language: { type: String, default: "en" },
    maintenanceMode: { type: Boolean, default: false },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      ogImage: { type: String },
      keywords: [{ type: String }],
      googleAnalyticsId: { type: String },
    },
    theme: {
      primaryColor: { type: String, default: "#18181b" },
      secondaryColor: { type: String, default: "#71717a" },
      accentColor: { type: String, default: "#3b82f6" },
      fontHeading: { type: String, default: "Inter" },
      fontBody: { type: String, default: "Inter" },
      darkMode: { type: Boolean, default: true },
    },
  },
  baseSchemaOptions
);

export const SiteSettings = model<ISiteSettings>("SiteSettings", siteSettingsSchema);
