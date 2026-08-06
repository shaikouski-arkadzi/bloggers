import { Request, Response } from "express";
import { PaginatorBlog, SortBy } from "../types";
import { blogRepository } from "../repositories";
import { SortDirection } from "../../common/types";

interface BlogsQuery {
  pageNumber?: string;
  pageSize?: string;
  sortBy?: SortBy;
  sortDirection?: SortDirection;
  searchNameTerm?: string;
}

export const getBlogs = async (
  req: Request<{}, {}, {}, BlogsQuery>,
  res: Response<PaginatorBlog>,
) => {
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const sortBy = req.query.sortBy || "createdAt";
  const sortDirection = req.query.sortDirection === "asc" ? "asc" : "desc";
  const searchNameTerm = req.query.searchNameTerm || null;

  const allBlogsCount = await blogRepository.count();

  const pagesCount = Math.ceil(allBlogsCount / pageSize);

  const result = await blogRepository.find(
    page,
    pageSize,
    sortBy,
    sortDirection,
    searchNameTerm,
  );

  const returnData: PaginatorBlog = {
    pagesCount,
    page,
    pageSize,
    totalCount: allBlogsCount,
    items: result,
  };

  res.status(200).json(returnData);
};
