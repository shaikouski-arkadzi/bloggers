import { param } from "express-validator";

export const idValidation = param("id").exists().withMessage("ID is required");
