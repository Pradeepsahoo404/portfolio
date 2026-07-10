import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../errors/index.js";
import { ERROR_CODES } from "../constants/errorCodes.constants.js";
import { HTTP_STATUS } from "../constants/httpStatus.constants.js";
import { appConfig } from "../config/index.js";
import { logger } from "../utils/logger.util.js";
import { ApiResponse } from "../helpers/apiResponse.helper.js";
import type { MulterError } from "multer";

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  const requestId = res.locals.requestId as string | undefined;

  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error(err.message, { stack: err.stack, requestId });
    }

    return ApiResponse.error(
      res,
      err.message,
      err.statusCode,
      err.errorCode,
      err.errors
    );
  }

  if (err.name === "ValidationError" && "errors" in err) {
    const mongooseErrors = Object.entries(
      (err as { errors: Record<string, { message: string }> }).errors
    ).map(([field, e]) => ({ field, message: e.message }));

    return ApiResponse.error(
      res,
      "Validation failed",
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      ERROR_CODES.VALIDATION_ERROR,
      mongooseErrors
    );
  }

  if (err.name === "CastError") {
    return ApiResponse.error(
      res,
      "Invalid ID format",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.BAD_REQUEST
    );
  }

  if (err.name === "MongoServerError" && (err as { code?: number }).code === 11000) {
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue;
    const field = keyValue ? Object.keys(keyValue)[0] : "field";
    return ApiResponse.error(
      res,
      `${field} already exists`,
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.CONFLICT
    );
  }

  if (err.name === "JsonWebTokenError") {
    return ApiResponse.error(
      res,
      "Invalid token",
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.TOKEN_INVALID
    );
  }

  if (err.name === "TokenExpiredError") {
    return ApiResponse.error(
      res,
      "Token expired",
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.TOKEN_EXPIRED
    );
  }

  if (err.name === "MulterError") {
    const message =
      (err as MulterError).code === "LIMIT_FILE_SIZE"
        ? "File too large"
        : err.message;
    return ApiResponse.error(
      res,
      message,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.BAD_REQUEST
    );
  }

  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    requestId,
    path: req.path,
    method: req.method,
  });

  const message = appConfig.isProduction
    ? "Internal server error"
    : err.message;

  return ApiResponse.error(
    res,
    message,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ERROR_CODES.INTERNAL_ERROR
  );
};

export default errorMiddleware;
