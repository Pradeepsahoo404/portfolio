import type { FilterQuery } from "mongoose";

export interface FilterOptions {
  allowedFields: string[];
  query: Record<string, unknown>;
}

export function buildFilter<T>(
  options: FilterOptions
): FilterQuery<T> {
  const { allowedFields, query } = options;
  const filter: FilterQuery<T> = {};

  for (const field of allowedFields) {
    const value = query[field];
    if (value === undefined || value === null || value === "") continue;

    if (typeof value === "string" && value.includes(",")) {
      (filter as Record<string, unknown>)[field] = {
        $in: value.split(",").map((v) => v.trim()),
      };
    } else if (field.endsWith("From") || field.endsWith("To")) {
      continue;
    } else {
      (filter as Record<string, unknown>)[field] = value;
    }
  }

  const dateFrom = query.createdFrom ?? query.dateFrom;
  const dateTo = query.createdTo ?? query.dateTo;

  if (dateFrom || dateTo) {
    const dateFilter: Record<string, Date> = {};
    if (dateFrom) dateFilter.$gte = new Date(String(dateFrom));
    if (dateTo) dateFilter.$lte = new Date(String(dateTo));
    (filter as Record<string, unknown>).createdAt = dateFilter;
  }

  return filter;
}

export function buildDateRangeFilter(
  field: string,
  from?: string,
  to?: string
): Record<string, unknown> | null {
  if (!from && !to) return null;
  const range: Record<string, Date> = {};
  if (from) range.$gte = new Date(from);
  if (to) range.$lte = new Date(to);
  return { [field]: range };
}
