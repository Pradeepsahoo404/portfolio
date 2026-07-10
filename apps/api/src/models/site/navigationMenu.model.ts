import { Schema, model, Document, Types } from "mongoose";
import { MENU_LOCATIONS, type MenuLocation } from "../../constants/content.constants.js";
import { baseSchemaOptions, addSoftDelete } from "../base/base.schema.js";

export interface IMenuItem {
  label: string;
  url?: string;
  slug?: string;
  pageId?: Types.ObjectId;
  categoryId?: Types.ObjectId;
  openInNewTab: boolean;
  order: number;
  children?: IMenuItem[];
}

export interface INavigationMenu extends Document {
  workspaceId: Types.ObjectId;
  name: string;
  location: MenuLocation;
  items: IMenuItem[];
  isActive: boolean;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    slug: { type: String, trim: true },
    pageId: { type: Schema.Types.ObjectId, ref: "Page" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    openInNewTab: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    children: [{ type: Schema.Types.Mixed }],
  },
  { _id: true }
);

const navigationMenuSchema = new Schema<INavigationMenu>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    location: {
      type: String,
      enum: Object.values(MENU_LOCATIONS),
      required: true,
    },
    items: [menuItemSchema],
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions
);

addSoftDelete(navigationMenuSchema);
navigationMenuSchema.index({ workspaceId: 1, location: 1 }, { unique: true });

export const NavigationMenu = model<INavigationMenu>("NavigationMenu", navigationMenuSchema);
