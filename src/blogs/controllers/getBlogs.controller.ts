import { Request, Response } from "express";
import { PaginatorBlog } from "../types";
import { blogRepository } from "../repositories";

interface BlogsQuery {
  pageNumber?: string;
  pageSize?: string;
}

export const getBlogs = async (
  req: Request<{}, {}, {}, BlogsQuery>,
  res: Response<PaginatorBlog>,
) => {
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = Number(req.query.pageSize) || 10;

  const allBlogsCount = await blogRepository.count();

  const pagesCount = Math.ceil(allBlogsCount / pageSize);

  const result = await blogRepository.find(page, pageSize);

  const returnData: PaginatorBlog = {
    pagesCount,
    page,
    pageSize,
    totalCount: allBlogsCount,
    items: result,
  };

  res.status(200).json(returnData);
};
