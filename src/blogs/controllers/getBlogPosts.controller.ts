import { Request, Response } from "express";
import { Post, PostsQuery } from "../../posts/types";
import { PaginatorData } from "../../common/types";
import { matchedData } from "express-validator";
import { postsService } from "../../posts/application/posts.service";

export const getBlogPosts = async (
  req: Request<{ id: string }, {}, {}, PostsQuery>,
  res: Response<PaginatorData<Post>>,
) => {
  const id = req.params.id;

  const blogsQueries = matchedData<PostsQuery>(req);

  const result = await postsService.findManyByBlog(id, blogsQueries);

  res.status(200).json(result);
};
