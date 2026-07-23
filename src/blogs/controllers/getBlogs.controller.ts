import { Request, Response } from "express";
import { Blog } from "../types";
import { blogRepository } from "../repositories";

export const getBlogs = async (_req: Request, res: Response<Blog[]>) => {
  const result = await blogRepository.findAll();

  res.status(200).json(result);
};
