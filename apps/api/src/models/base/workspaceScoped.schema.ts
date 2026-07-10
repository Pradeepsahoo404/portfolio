import { Schema, Types } from "mongoose";
import { CONTENT_STATUS } from "../../constants/content.constants.js";

export interface IWorkspaceScoped {
  workspaceId: Types.ObjectId;
  status: string;
  order: number;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

export const workspaceScopedFields = {
  workspaceId: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: Object.values(CONTENT_STATUS),
    default: CONTENT_STATUS.PUBLISHED,
    index: true,
  },
  order: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
};
