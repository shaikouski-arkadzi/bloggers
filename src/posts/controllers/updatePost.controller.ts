import { Request, Response } from "express";
import { PostInputDto } from "../types";
import { APIErrorResult, FieldError } from "../../common/types";
import { postRepository } from "../repositories";
import { blogRepository } from "../../blogs/repositories";

export const updatePost = (
  req: Request<{ id: string }, {}, PostInputDto>,
  res: Response<APIErrorResult | null>,
) => {
  const post = req.body;
  const { title, shortDescription, content, blogId } = post;

  const { id } = req.params;

  console.log(title, shortDescription, content, blogId, id);

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
  } else if (!blogRepository.findById(blogId)) {
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

  const result = postRepository.update(id, post);

  if (!result) {
    return res.sendStatus(404);
  }

  res.sendStatus(204);
};
