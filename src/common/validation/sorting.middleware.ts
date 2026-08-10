import { query } from "express-validator";
import { SortDirections } from "../types";

export const sortDirectionValidation = query("sortDirection")
  .isIn(Object.values(SortDirections))
  .withMessage("Проверьте значение в sortDirection");
