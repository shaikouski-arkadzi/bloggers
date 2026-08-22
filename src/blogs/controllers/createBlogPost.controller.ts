import { Request, Response } from "express";
import { APIErrorResult } from "../../common/types";
import { Post, PostInputDto } from "../../posts/types";
import { postsService } from "../../posts/application/posts.service";
import { NotFoundException } from "../../common/exceptions";

type RequestBody = Omit<PostInputDto, "blogId">;

export const createBlogPost = async (
  req: Request<{ id: string }, {}, RequestBody>,
  res: Response<Post | APIErrorResult>,
) => {
  try {
    const blogId = req.params.id;
    const post = req.body;

    const payload: PostInputDto = {
      ...post,
      blogId,
    };

    const newPost = await postsService.create(payload);

    if (newPost) res.status(201).json(newPost);
  } catch (error) {
    if (error instanceof NotFoundException) {
      res.sendStatus(404);
    }
    if (error instanceof Error) {
      res.sendStatus(500);
    }
  }
};
