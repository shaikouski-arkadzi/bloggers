import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { PaginatorData } from "../../common/types";
import { postsService } from "../application/posts.service";
import { Post, PostsQuery } from "../types";

export const getPosts = async (
  req: Request<{}, {}, {}, PostsQuery>,
  res: Response<PaginatorData<Post>>,
) => {
  const blogsQueries = matchedData<PostsQuery>(req);

  const result = await postsService.findMany(blogsQueries);

  res.status(200).json(result);
};
