import { Request, Response } from "express";
import { PaginatorBlog } from "../types";
import { blogRepository } from "../repositories";

export const getBlogs = async (_req: Request, res: Response<PaginatorBlog>) => {
  const result = await blogRepository.findAll();

  const returnData: PaginatorBlog = {
    pagesCount: 0,
    page: 0,
    pageSize: 0,
    totalCount: 0,
    items: result,
  };

  res.status(200).json(returnData);
};
