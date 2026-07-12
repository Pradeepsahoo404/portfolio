import { Schema, model, Document } from "mongoose";
import { ROLES, type Role } from "../../constants/roles.constants.js";
import { AUTH_PROVIDERS, type AuthProvider } from "../../constants/auth.constants.js";
import { baseSchemaOptions, addSoftDelete } from "../base/base.schema.js";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  avatar?: string;
  role: Role;
  authProvider: AuthProvider;
  googleId?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  fullName: string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
      minlength: [8, "Password must be at least 8 characters"],
    },
    avatar: { type: String },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    authProvider: {
      type: String,
      enum: Object.values(AUTH_PROVIDERS),
      default: AUTH_PROVIDERS.LOCAL,
    },
    googleId: { type: String, sparse: true, index: true },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  baseSchemaOptions
);

userSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret) {
    const obj = ret as unknown as Record<string, unknown>;
    delete obj.password;
    delete obj.__v;
    return obj;
  },
});

addSoftDelete(userSchema);

userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

export const User = model<IUser>("User", userSchema);
