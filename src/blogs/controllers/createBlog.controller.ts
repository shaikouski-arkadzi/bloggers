import { Request, Response } from "express";
import { BlogInputDto } from "../types";
import { APIErrorResult, FieldError } from "../../common/types";
import { WEBSITE_URL_PATTERN } from "../../common/constants";

export const createBlog = (
  req: Request<{}, {}, BlogInputDto>,
  res: Response<{} | APIErrorResult>,
) => {
  const { name, description, websiteUrl } = req.body;

  console.log(name, description, websiteUrl);

  const messages: FieldError[] = [];

  if (!name?.trim()) {
    messages.push({
      message: "Поле обязательное",
      field: "name",
    });
  }

  if (name?.trim().length > 15) {
    messages.push({
      message: "Максимальная длина 15 символов",
      field: "name",
    });
  }

  if (!description?.trim()) {
    messages.push({
      message: "Поле обязательное",
      field: "description",
    });
  }

  if (description?.trim().length > 500) {
    messages.push({
      message: "Максимальная длина 500 символов",
      field: "description",
    });
  }

  if (!websiteUrl?.trim()) {
    messages.push({
      message: "Поле обязательное",
      field: "websiteUrl",
    });
  }

  if (websiteUrl?.trim().length > 100) {
    messages.push({
      message: "Максимальная длина 100 символов",
      field: "websiteUrl",
    });
  }

  if (!WEBSITE_URL_PATTERN.test(websiteUrl)) {
    messages.push({
      message: "Некорректный url",
      field: "websiteUrl",
    });
  }

  if (messages.length) {
    return res.status(400).json({
      errorsMessages: messages,
    });
  }

  res.status(201).json({});
};
