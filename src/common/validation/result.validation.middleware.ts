import { validationResult, ValidationError } from "express-validator";
import { Request, Response, NextFunction } from "express";

const formatErrors = (error: ValidationError) => {
  if (error.type === "field") {
    return { field: error.path, message: error.msg };
  }
  return { field: "", message: error.msg };
};

export const resultValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  if (errors.length > 0) {
    res.status(400).json({ errorMessages: errors });
    return;
  }

  next();
};
