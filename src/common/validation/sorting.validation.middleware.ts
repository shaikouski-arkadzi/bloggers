import { query } from "express-validator";
import { SortDirections } from "../types";
import { Blog } from "../../blogs/types";
import { Post } from "../../posts/types";
import { User } from "../../users/types";
import { SORT_DIRECTION_DAFAULT, SORT_FIELD_DAFAULT } from "../constants";

export const sortFieldValidation = <T extends Blog | Post | User>(
  fields: (keyof T)[],
) =>
  query("sortBy")
    .default(SORT_FIELD_DAFAULT)
    .isIn(fields)
    .withMessage("Проверьте значение в sortBy");

export const sortDirectionValidation = query("sortDirection")
  .default(SORT_DIRECTION_DAFAULT)
  .isIn(Object.values(SortDirections))
  .withMessage("Проверьте значение в sortDirection");

export const sortingValidation = <T extends Blog | Post | User>(
  fields: (keyof T)[],
) => [sortFieldValidation(fields), sortDirectionValidation];
