import { Schema, model, Document, Types } from "mongoose";
import { TOKEN_TYPES, type TokenType } from "../../constants/auth.constants.js";
import { baseSchemaOptions } from "../base/base.schema.js";

export interface IUserToken extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  type: TokenType;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userTokenSchema = new Schema<IUserToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(TOKEN_TYPES),
      required: true,
    },
    expiresAt: { type: Date, required: true },
    isUsed: { type: Boolean, default: false },
  },
  baseSchemaOptions
);

userTokenSchema.index({ userId: 1, type: 1 });
userTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const UserToken = model<IUserToken>("UserToken", userTokenSchema);
