import { Request, Response } from "express";
import { Blog, BlogInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { blogsService } from "../application/blogs.service";
import { blogsQueryRepository } from "../repositories";
import { SavingException } from "../exceptions";

export const createBlog = async (
  req: Request<{}, {}, BlogInputDto>,
  res: Response<Blog | APIErrorResult>,
) => {
  const blog = req.body;

  const newBlogId = await blogsService.create(blog);

  const createdBlog = await blogsQueryRepository.findById(newBlogId);

  if (!createdBlog) throw new SavingException();

  res.status(201).json(createdBlog);
};
