import { Request, Response } from "express";
import { Blog, BlogInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { blogsService } from "../application/blogs.service";

export const createBlog = async (
  req: Request<{}, {}, BlogInputDto>,
  res: Response<Blog | APIErrorResult>,
) => {
  const blog = req.body;

  const newBlog = await blogsService.create(blog);

  res.status(201).json(newBlog);
};
