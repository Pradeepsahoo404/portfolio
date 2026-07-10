export interface PaginationDto {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

export interface IdParamDto {
  id: string;
}
