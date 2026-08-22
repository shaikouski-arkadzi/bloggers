import { param } from "express-validator";

export const idValidation = param("id")
  .exists()
  .withMessage("ID обязателен")
  .isMongoId()
  .withMessage("Некорректный ID");
