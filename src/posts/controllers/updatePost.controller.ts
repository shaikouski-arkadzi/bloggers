import { Request, Response } from "express";
import {  PostInputDto } from "../types";
import { APIErrorResult, FieldError } from "../../common/types";
import { db } from "../../db";

export const updatePost = (
  req: Request<{ id: string }, {}, PostInputDto>,
  res: Response<APIErrorResult | null>,
) => {
  const { title,shortDescription,content,blogId } = req.body;

  const { id } = req.params;

  console.log(title,shortDescription,content,blogId, id);

  const postIndex = db.posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return res.sendStatus(404);
  }

  const messages: FieldError[] = [];

  if (title === undefined) {
    messages.push({
      message: "Поле обязательное",
      field: "title",
    });
  } else if (typeof title !== "string") {
    messages.push({
      message: "Поле должно быть типом string",
      field: "title",
    });
  } else if (title.trim().length > 30) {
    messages.push({
      message: "Максимальная длина 30 символов",
      field: "title",
    });
  }

  if (shortDescription === undefined) {
    messages.push({
      message: "Поле обязательное",
      field: "shortDescription",
    });
  } else if (typeof shortDescription !== "string") {
    messages.push({
      message: "Поле должно быть типом string",
      field: "shortDescription",
    });
  } else if (shortDescription.trim().length > 100) {
    messages.push({
      message: "Максимальная длина 100 символов",
      field: "shortDescription",
    });
  }

  if (content === undefined) {
    messages.push({
      message: "Поле обязательное",
      field: "content",
    });
  } else if (typeof content !== "string") {
    messages.push({
      message: "Поле должно быть типом string",
      field: "content",
    });
  } else if (content.trim().length > 1000) {
    messages.push({
      message: "Максимальная длина 1000 символов",
      field: "content",
    });
  }

  if (blogId === undefined) {
    messages.push({
      message: "Поле обязательное",
      field: "blogId",
    });
  } else if (typeof blogId !== "string") {
    messages.push({
      message: "Поле должно быть типом string",
      field: "blogId",
    });
  } else if (!db.blogs.find((b) => b.id === blogId)) {
    messages.push({
      message: "Не найдено блога с таким идентификатором",
      field: "blogId",
    });
  }

  if (messages.length) {
    return res.status(400).json({
      errorsMessages: messages,
    });
  }

  db.posts[postIndex] = {
    ...db.posts[postIndex],
    title,
    shortDescription,
    content,
    blogId
  };

  console.log(db.posts);

  res.sendStatus(204);
};
