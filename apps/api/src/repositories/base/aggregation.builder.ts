import { PipelineStage } from "mongoose";

export class AggregationBuilder {
  private pipeline: PipelineStage[] = [];

  match(conditions: Record<string, unknown>): this {
    this.pipeline.push({ $match: conditions });
    return this;
  }

  lookup(from: string, localField: string, foreignField: string, as: string): this {
    this.pipeline.push({
      $lookup: { from, localField, foreignField, as },
    });
    return this;
  }

  unwind(path: string, preserveNullAndEmptyArrays = false): this {
    this.pipeline.push({
      $unwind: { path: `$${path}`, preserveNullAndEmptyArrays },
    });
    return this;
  }

  sort(sortObj: Record<string, 1 | -1>): this {
    this.pipeline.push({ $sort: sortObj });
    return this;
  }

  skip(count: number): this {
    this.pipeline.push({ $skip: count });
    return this;
  }

  limit(count: number): this {
    this.pipeline.push({ $limit: count });
    return this;
  }

  project(fields: Record<string, unknown>): this {
    this.pipeline.push({ $project: fields });
    return this;
  }

  group(id: Record<string, unknown> | string | null, accumulators: Record<string, unknown>): this {
    this.pipeline.push({ $group: { _id: id, ...accumulators } });
    return this;
  }

  addFields(fields: Record<string, unknown>): this {
    this.pipeline.push({ $addFields: fields });
    return this;
  }

  facet(facets: Record<string, PipelineStage[]>): this {
    this.pipeline.push({ $facet: facets } as PipelineStage);
    return this;
  }

  build(): PipelineStage[] {
    return [...this.pipeline];
  }

  reset(): this {
    this.pipeline = [];
    return this;
  }
}

export default AggregationBuilder;
