import { Schema, Document, Model } from "mongoose";

export interface IBaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export const baseSchemaOptions = {
  timestamps: true,
  versionKey: false as const,
};

export function addSoftDelete(schema: Schema): void {
  schema.add({
    deletedAt: { type: Date, default: null, index: true },
  });

  schema.pre("find", function () {
    if (!("deletedAt" in this.getQuery())) {
      this.where({ deletedAt: null });
    }
  });

  schema.pre("findOne", function () {
    if (!("deletedAt" in this.getQuery())) {
      this.where({ deletedAt: null });
    }
  });

  schema.pre("countDocuments", function () {
    if (!("deletedAt" in this.getQuery())) {
      this.where({ deletedAt: null });
    }
  });
}

export type BaseModel<T> = Model<T & IBaseDocument>;
