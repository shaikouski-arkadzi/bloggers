import { body } from "express-validator";

export const newPasswordValidation = body("newPassword")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .isLength({ min: 6, max: 20 })
  .withMessage("Пароль должен содержать от 6 до 20 символов");

export const recoveryCodeValidation = body("recoveryCode")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .trim()
  .notEmpty()
  .withMessage("Код восстановления обязателен");

export const newPasswordRecoveryInputModelValidation = [
  newPasswordValidation,
  recoveryCodeValidation,
];
