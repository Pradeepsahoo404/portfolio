import type { Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus.constants.js";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
  requestId?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode: string;
  errors?: Array<{ field: string; message: string }>;
  requestId?: string;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = "Success",
    statusCode: number = HTTP_STATUS.OK,
    meta?: PaginationMeta
  ): Response {
    const body: ApiSuccessResponse<T> = {
      success: true,
      message,
      data,
      ...(meta && { meta }),
      ...(res.locals.requestId && { requestId: res.locals.requestId }),
    };
    return res.status(statusCode).json(body);
  }

  static created<T>(
    res: Response,
    data: T,
    message = "Resource created successfully"
  ): Response {
    return ApiResponse.success(res, data, message, HTTP_STATUS.CREATED);
  }

  static noContent(res: Response): Response {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  static error(
    res: Response,
    message: string,
    statusCode: number,
    errorCode: string,
    errors?: Array<{ field: string; message: string }>
  ): Response {
    const body: ApiErrorResponse = {
      success: false,
      message,
      errorCode,
      ...(errors && { errors }),
      ...(res.locals.requestId && { requestId: res.locals.requestId }),
    };
    return res.status(statusCode).json(body);
  }
}

export default ApiResponse;
