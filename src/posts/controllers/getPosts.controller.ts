import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { PaginatorData } from "../../common/types";
import { Post, PostsQuery } from "../types";
import { postsService } from "../composition-root";

export const getPosts = async (
  req: Request<{}, {}, {}, PostsQuery>,
  res: Response<PaginatorData<Post>>,
) => {
  try {
    const blogsQueries = matchedData<PostsQuery>(req);

    const result = await postsService.findMany(blogsQueries);

    return res.status(200).json(result);
  } catch (error) {
    return res.sendStatus(500);
  }
};
