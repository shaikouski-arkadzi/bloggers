import { body } from "express-validator";
import { blogRepository } from "../../blogs/repositories";

export const titleValidation = body("title")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .trim()
  .notEmpty()
  .withMessage("Поле не должно быть пустым")
  .isLength({ max: 30 })
  .withMessage("Максимальная длина 30 символов");

export const shortDescriptionValidation = body("shortDescription")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .trim()
  .notEmpty()
  .withMessage("Поле не должно быть пустым")
  .isLength({ max: 100 })
  .withMessage("Максимальная длина 100 символов");

export const contentValidation = body("content")
  .exists()
  .withMessage("Поле обязательное")
  .isString()
  .withMessage("Поле должно быть типом string")
  .trim()
  .notEmpty()
  .withMessage("Поле не должно быть пустым")
  .isLength({ max: 1000 })
  .withMessage("Максимальная длина 1000 символов");

export const blogIdValidation = body("blogId")
  .exists()
  .withMessage("Поле обязательное")
  .bail()
  .isString()
  .withMessage("Поле должно быть типом string")
  .bail()
  .trim()
  .notEmpty()
  .bail()
  .withMessage("Поле не должно быть пустым")
  .isLength({ min: 24, max: 24 })
  .withMessage("Некорректый id")
  .bail()
  .custom(async (blogId) => {
    const blog = await blogRepository.findById(blogId);

    if (!blog) {
      throw new Error("Не найдено блога с таким идентификатором");
    }

    return true;
  });

export const postInputDtoValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];
