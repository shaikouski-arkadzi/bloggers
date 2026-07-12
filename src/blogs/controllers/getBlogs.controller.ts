import { Request, Response } from "express";
import { Blog } from "../types";
import { blogRepository } from "../repositories";

export const getBlogs = (_req: Request, res: Response<Blog[]>) => {
  res.status(200).json(blogRepository.findAll());
};
