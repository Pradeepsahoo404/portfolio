import { PAGINATION } from "../constants/pagination.constants.js";
import type { PaginationMeta } from "./apiResponse.helper.js";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationQuery {
  page?: string | number;
  limit?: string | number;
}

export function parsePagination(query: PaginationQuery): PaginationParams {
  let page = parseInt(String(query.page ?? PAGINATION.DEFAULT_PAGE), 10);
  let limit = parseInt(String(query.limit ?? PAGINATION.DEFAULT_LIMIT), 10);

  if (isNaN(page) || page < 1) page = PAGINATION.DEFAULT_PAGE;
  if (isNaN(limit) || limit < 1) limit = PAGINATION.DEFAULT_LIMIT;
  if (limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.MAX_LIMIT;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
