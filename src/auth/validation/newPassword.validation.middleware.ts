import { body } from "express-validator";

export const newPasswordValidation = body("newPassword")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .trim()
  .notEmpty()
  .withMessage("Поле не должно быть пустым");
