import { body } from "express-validator";
import { EMAIL_PATTERN, LOGIN_PATTERN } from "../../common/constants";

export const loginValidation = body("login")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .trim()
  .notEmpty()
  .withMessage("Поле не должно быть пустым")
  .isLength({ min: 3, max: 10 })
  .withMessage("Длина 3-10 символов")
  .matches(LOGIN_PATTERN)
  .withMessage(
    "Строка может содержать только латинские буквы, цифры, символы '_' и '-'.",
  );

export const passwordValidation = body("password")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .trim()
  .notEmpty()
  .withMessage("Поле не должно быть пустым")
  .isLength({ min: 6, max: 20 })
  .withMessage("Длина 6-20 символов");

export const emailValidation = body("email")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .trim()
  .notEmpty()
  .withMessage("Поле не должно быть пустым")
  .matches(EMAIL_PATTERN)
  .withMessage("Некорректный email");

export const userInputDtoValidation = [
  loginValidation,
  passwordValidation,
  emailValidation,
];
