import { body } from "express-validator";

export const contentValidation = body("content")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .trim()
  .notEmpty()
  .withMessage("Поле не должно быть пустым")
  .isLength({ min: 20, max: 300 })
  .withMessage("Длина должан быть от 20 до 300");
