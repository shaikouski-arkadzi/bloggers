import { query } from "express-validator";

export const pageNumberValidation = query("pageNumber")
  .isInt({ min: 1 })
  .withMessage("Номер страницы должен быть больше 0");

export const pageSizeValidation = query("pageSize")
  .isInt({ min: 1 })
  .withMessage("Количество элементов на странице должно быть больше 0");
