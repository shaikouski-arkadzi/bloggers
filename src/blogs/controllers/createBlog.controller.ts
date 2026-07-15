import { Request, Response } from "express";
import { Blog, BlogInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { blogRepository } from "../repositories";

export const createBlog = (
  req: Request<{}, {}, BlogInputDto>,
  res: Response<Blog | APIErrorResult>,
) => {
  const blog = req.body;

  const newBlog = blogRepository.create(blog);

  res.status(201).json(newBlog);
};
