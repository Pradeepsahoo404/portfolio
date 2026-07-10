import { validationResult, type ValidationChain } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/index.js";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err) => ({
        field: "path" in err ? String(err.path) : "unknown",
        message: err.msg as string,
      }));
      return next(new ValidationError("Validation failed", formattedErrors));
    }

    next();
  };
};

export default validate;
