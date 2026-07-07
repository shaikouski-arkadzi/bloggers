import { Request, Response } from "express";
import { BlogInputDto } from "../types";
import { APIErrorResult, FieldError } from "../../common/types";
import { WEBSITE_URL_PATTERN } from "../../common/constants";
import { db } from "../../db";

export const updateBlog = (
  req: Request<{ id: string }, {}, BlogInputDto>,
  res: Response<APIErrorResult | null>,
) => {
  const { name, description, websiteUrl } = req.body;

  const { id } = req.params;

  console.log(name, description, websiteUrl, id);

  const blogIndex = db.blogs.findIndex((b) => b.id === id);

  if (blogIndex === -1) {
    return res.sendStatus(404);
  }

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

  if (typeof name !== "string") {
    messages.push({
      message: "Поле должно быть типом string",
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

  if (typeof description !== "string") {
    messages.push({
      message: "Поле должно быть типом string",
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
  
  if (typeof websiteUrl !== "string") {
    messages.push({
      message: "Поле должно быть типом string",
      field: "websiteUrl",
    });
  }

  if (messages.length) {
    return res.status(400).json({
      errorsMessages: messages,
    });
  }

  db.blogs[blogIndex] = {
    ...db.blogs[blogIndex],
    name,
    description,
    websiteUrl,
  };

  console.log(db.blogs);

  res.sendStatus(204);
};
