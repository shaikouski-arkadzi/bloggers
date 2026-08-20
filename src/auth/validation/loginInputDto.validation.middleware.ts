import { body } from "express-validator";

export const loginOrEmailValidation = body("loginOrEmail")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .trim()
  .notEmpty()
  .withMessage("Поле не должно быть пустым");

export const passwordValidation = body("password")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .trim()
  .notEmpty()
  .withMessage("Поле не должно быть пустым");

export const loginInputDtoValidation = [
  loginOrEmailValidation,
  passwordValidation,
];
