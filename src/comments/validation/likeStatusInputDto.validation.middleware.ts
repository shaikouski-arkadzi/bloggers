import { body } from "express-validator";

export const likeStatusInputValidation = body("likeStatus")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .trim()
  .notEmpty()
  .withMessage("Поле не должно быть пустым")
  .isIn(["None", "Like", "Dislike"])
  .withMessage("Допустимые значения: None, Like, Dislike");
