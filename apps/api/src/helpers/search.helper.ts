import type { FilterQuery } from "mongoose";

export interface SearchOptions {
  search?: string;
  searchFields: string[];
}

export function buildSearch<T>(options: SearchOptions): FilterQuery<T> {
  const { search, searchFields } = options;

  if (!search || searchFields.length === 0) {
    return {};
  }

  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  return {
    $or: searchFields.map((field) => ({ [field]: regex })),
  } as FilterQuery<T>;
}

export function buildTextSearch<T>(search?: string): FilterQuery<T> {
  if (!search) return {};
  return { $text: { $search: search } } as FilterQuery<T>;
}
