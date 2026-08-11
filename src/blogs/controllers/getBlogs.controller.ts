import { Request, Response } from "express";
import { Blog } from "../types";
import { blogRepository } from "../repositories";
import {
  SortDirection,
  PaginatorData,
  SortBy,
  SortDirections,
} from "../../common/types";
import {
  PAGE_DAFAULT,
  PAGE_SIZE_DAFAULT,
  SORT_FIELD_DAFAULT,
} from "../../common/constants";

interface BlogsQuery {
  pageNumber?: string;
  pageSize?: string;
  sortBy?: SortBy<Blog>;
  sortDirection?: SortDirection;
  searchNameTerm?: string;
}

export const getBlogs = async (
  req: Request<{}, {}, {}, BlogsQuery>,
  res: Response<PaginatorData<Blog>>,
) => {
  const page = Number(req.query.pageNumber) || PAGE_DAFAULT;
  const pageSize = Number(req.query.pageSize) || PAGE_SIZE_DAFAULT;
  const sortBy = req.query.sortBy || SORT_FIELD_DAFAULT;
  const sortDirection =
    req.query.sortDirection === SortDirections.ASC
      ? SortDirections.ASC
      : SortDirections.DESC;
  const searchNameTerm = req.query.searchNameTerm || null;

  const allBlogsCount = await blogRepository.count(
    searchNameTerm ? { name: searchNameTerm } : {},
  );

  const pagesCount = Math.ceil(allBlogsCount / pageSize);

  const result = await blogRepository.find({
    page,
    pageSize,
    sortBy,
    sortDirection,
    searchNameTerm,
  });

  const returnData: PaginatorData<Blog> = {
    pagesCount,
    page,
    pageSize,
    totalCount: allBlogsCount,
    items: result,
  };

  res.status(200).json(returnData);
};
