import { query } from "express-validator";
import { SortDirections } from "../types";
import { Blog } from "../../blogs/types";
import { Post } from "../../posts/types";

export const sortFieldValidation = <T extends Blog | Post>(
  fields: (keyof T)[],
) => query("sortBy").isIn(fields).withMessage("Проверьте значение в sortBy");

export const sortDirectionValidation = query("sortDirection")
  .isIn(Object.values(SortDirections))
  .withMessage("Проверьте значение в sortDirection");

export const sortingValidation = [sortFieldValidation, sortDirectionValidation];
