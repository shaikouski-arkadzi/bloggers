import { query } from "express-validator";
import { PAGE_DAFAULT, PAGE_SIZE_DAFAULT } from "../constants";

export const pageNumberValidation = query("pageNumber")
  .default(PAGE_DAFAULT)
  .isInt({ min: 1 })
  .withMessage("Номер страницы должен быть больше 0");

export const pageSizeValidation = query("pageSize")
  .default(PAGE_SIZE_DAFAULT)
  .isInt({ min: 1 })
  .withMessage("Количество элементов на странице должно быть больше 0");

export const paginationValidation = [pageNumberValidation, pageSizeValidation];
