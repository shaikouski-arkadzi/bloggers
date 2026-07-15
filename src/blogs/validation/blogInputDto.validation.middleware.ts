import { body } from "express-validator";
import { WEBSITE_URL_PATTERN } from "../../common/constants";

export const nameValidation = body("name")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .isLength({ max: 15 })
  .withMessage("Максимальная длина 15 символов");

export const descriptionValidation = body("description")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .isLength({ max: 500 })
  .withMessage("Максимальная длина 500 символов");

export const websiteUrlValidation = body("websiteUrl")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .isLength({ max: 100 })
  .withMessage("Максимальная длина 100 символов")
  .matches(WEBSITE_URL_PATTERN)
  .withMessage("Некорректный url");

export const blogInputDtoValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];
