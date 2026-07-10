import { Schema, model, Document, Types } from "mongoose";
import { baseSchemaOptions, addSoftDelete } from "../base/base.schema.js";
import { workspaceScopedFields } from "../base/workspaceScoped.schema.js";

export interface ITestimonial extends Document {
  workspaceId: Types.ObjectId;
  clientId: Types.ObjectId;
  projectId?: Types.ObjectId;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  content: string;
  rating: number;
  status: string;
  order: number;
  createdBy?: Types.ObjectId;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    ...workspaceScopedFields,
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", index: true },
    authorName: { type: String, required: true, trim: true },
    authorRole: { type: String, trim: true },
    authorAvatar: { type: String },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
  },
  baseSchemaOptions
);

addSoftDelete(testimonialSchema);
testimonialSchema.index({ workspaceId: 1, clientId: 1 });

export const Testimonial = model<ITestimonial>("Testimonial", testimonialSchema);
