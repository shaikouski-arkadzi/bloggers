import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { PaginatorData } from "../../common/types";
import { Blog, BlogsQuery } from "../types";
import { blogsService } from "../application/blogs.service";

export const getBlogs = async (
  req: Request<{}, {}, {}, BlogsQuery>,
  res: Response<PaginatorData<Blog>>,
) => {
  const blogsQueries = matchedData<BlogsQuery>(req);

  const result = await blogsService.findMany(blogsQueries);

  res.status(200).json(result);
};
