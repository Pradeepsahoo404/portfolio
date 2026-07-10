import type { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
import { PipelineStage } from "mongoose";
import { NotFoundError } from "../../errors/index.js";
import {
  parsePagination,
  buildPaginationMeta,
  buildFilter,
  buildSort,
  buildSearch,
  type PaginationMeta,
} from "../../helpers/index.js";
import { AggregationBuilder } from "./aggregation.builder.js";

export interface QueryOptions {
  page?: string | number;
  limit?: string | number;
  sort?: string;
  search?: string;
  filterFields?: string[];
  sortFields?: string[];
  searchFields?: string[];
  additionalFilter?: Record<string, unknown>;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const doc = await this.model.create(data);
    return doc;
  }

  async findById(id: string, filter: FilterQuery<T> = {}): Promise<T | null> {
    return this.model.findOne({ _id: id, ...filter, deletedAt: null } as FilterQuery<T>);
  }

  async findByIdOrFail(id: string, filter: FilterQuery<T> = {}): Promise<T> {
    const doc = await this.findById(id, filter);
    if (!doc) throw new NotFoundError(`${this.model.modelName} not found`);
    return doc;
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne({ ...filter, deletedAt: null } as FilterQuery<T>);
  }

  async update(id: string, data: UpdateQuery<T>, filter: FilterQuery<T> = {}): Promise<T | null> {
    return this.model.findOneAndUpdate(
      { _id: id, ...filter, deletedAt: null } as FilterQuery<T>,
      data,
      { new: true, runValidators: true }
    );
  }

  async softDelete(id: string, filter: FilterQuery<T> = {}): Promise<T | null> {
    return this.model.findOneAndUpdate(
      { _id: id, ...filter, deletedAt: null } as FilterQuery<T>,
      { deletedAt: new Date() } as UpdateQuery<T>,
      { new: true }
    );
  }

  async hardDelete(id: string, filter: FilterQuery<T> = {}): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id, ...filter } as FilterQuery<T>);
    return result.deletedCount > 0;
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments({ ...filter, deletedAt: null } as FilterQuery<T>);
  }

  async findAll(options: QueryOptions = {}): Promise<PaginatedResult<T>> {
    const {
      filterFields = [],
      sortFields = ["createdAt"],
      searchFields = [],
      additionalFilter = {},
    } = options;

    const { page, limit, skip } = parsePagination(options);
    const filter = buildFilter<T>({ allowedFields: filterFields, query: options as Record<string, unknown> });
    const search = buildSearch<T>({ search: options.search, searchFields });
    const sort = buildSort({ sort: options.sort, allowedFields: sortFields });

    const matchStage: FilterQuery<T> = {
      deletedAt: null,
      ...additionalFilter,
      ...filter,
      ...search,
    } as FilterQuery<T>;

    const pipeline = new AggregationBuilder()
      .match(matchStage as Record<string, unknown>)
      .sort(sort)
      .facet({
        data: [{ $skip: skip }, { $limit: limit }],
        meta: [{ $count: "total" }],
      })
      .build();

    const [result] = await this.model.aggregate(pipeline);
    const data = result?.data ?? [];
    const total = result?.meta?.[0]?.total ?? 0;

    return {
      data,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async aggregate<R = unknown>(pipeline: PipelineStage[]): Promise<R[]> {
    return this.model.aggregate<R>(pipeline);
  }

  getAggregationBuilder(): AggregationBuilder {
    return new AggregationBuilder();
  }
}
