import { randomUUID } from "node:crypto";
import { Request, Response } from "express";
import { Blog, BlogInputDto } from "../types";
import { APIErrorResult, FieldError } from "../../common/types";
import { WEBSITE_URL_PATTERN } from "../../common/constants";
import { db } from "../../db";

export const createBlog = (
  req: Request<{}, {}, BlogInputDto>,
  res: Response<Blog | APIErrorResult>,
) => {
  const { name, description, websiteUrl } = req.body;

  console.log(name, description, websiteUrl);

  const messages: FieldError[] = [];

  if (name === undefined) {
    messages.push({
      message: "Поле обязательное",
      field: "name",
    });
  } else if (typeof name !== "string") {
    messages.push({
      message: "Поле должно быть типом string",
      field: "name",
    });
  } else if (name.trim().length > 15) {
    messages.push({
      message: "Максимальная длина 15 символов",
      field: "name",
    });
  }

  if (description === undefined) {
    messages.push({
      message: "Поле обязательное",
      field: "description",
    });
  } else if (typeof description !== "string") {
    messages.push({
      message: "Поле должно быть типом string",
      field: "description",
    });
  } else if (description.trim().length > 500) {
    messages.push({
      message: "Максимальная длина 500 символов",
      field: "description",
    });
  }

  if (websiteUrl === undefined) {
    messages.push({
      message: "Поле обязательное",
      field: "websiteUrl",
    });
  } else if (typeof websiteUrl !== "string") {
    messages.push({
      message: "Поле должно быть типом string",
      field: "websiteUrl",
    });
  } else if (websiteUrl.trim().length > 100) {
    messages.push({
      message: "Максимальная длина 100 символов",
      field: "websiteUrl",
    });
  } else if (!WEBSITE_URL_PATTERN.test(websiteUrl)) {
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

  const newBlog = {
    id: randomUUID(),
    name,
    description,
    websiteUrl,
  };

  db.blogs.push(newBlog);

  console.log(db.blogs);

  res.status(201).json(newBlog);
};
