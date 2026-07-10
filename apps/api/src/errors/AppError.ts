import { ERROR_CODES, type ErrorCode } from "../constants/errorCodes.constants.js";

export abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly isOperational: boolean;
  public readonly errors?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode,
    isOperational = true,
    errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", errors?: Array<{ field: string; message: string }>) {
    super(message, 400, ERROR_CODES.BAD_REQUEST, true, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", errorCode: ErrorCode = ERROR_CODES.UNAUTHORIZED) {
    super(message, 401, errorCode, true);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, ERROR_CODES.FORBIDDEN, true);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, ERROR_CODES.NOT_FOUND, true);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409, ERROR_CODES.CONFLICT, true);
  }
}

export class ValidationError extends AppError {
  constructor(
    message = "Validation failed",
    errors?: Array<{ field: string; message: string }>
  ) {
    super(message, 422, ERROR_CODES.VALIDATION_ERROR, true, errors);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500, ERROR_CODES.INTERNAL_ERROR, false);
  }
}
