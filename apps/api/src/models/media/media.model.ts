import { Schema, model, Document, Types } from "mongoose";
import { baseSchemaOptions, addSoftDelete } from "../base/base.schema.js";

export interface IMedia extends Document {
  userId: Types.ObjectId;
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
  originalName: string;
  mimeType: string;
}

const mediaSchema = new Schema<IMedia>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    format: { type: String, required: true },
    resourceType: { type: String, default: "image" },
    bytes: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
  },
  baseSchemaOptions
);

addSoftDelete(mediaSchema);

mediaSchema.index({ userId: 1, createdAt: -1 });
mediaSchema.index({ publicId: 1 });

export const Media = model<IMedia>("Media", mediaSchema);
