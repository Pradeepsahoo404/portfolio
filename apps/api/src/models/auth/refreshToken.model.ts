import { Schema, model, Document, Types } from "mongoose";
import { baseSchemaOptions } from "../base/base.schema.js";

export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  isRevoked: boolean;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    isRevoked: { type: Boolean, default: false },
    userAgent: { type: String },
    ipAddress: { type: String },
  },
  baseSchemaOptions
);

refreshTokenSchema.index({ userId: 1, isRevoked: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = model<IRefreshToken>("RefreshToken", refreshTokenSchema);
