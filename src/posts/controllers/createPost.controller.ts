import { Request, Response } from "express";
import { Post, PostInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { postsService } from "../application/posts.service";

export const createPost = async (
  req: Request<{}, {}, PostInputDto>,
  res: Response<Post | APIErrorResult>,
) => {
  const post = req.body;

  const newPost = await postsService.create(post);

  if (newPost instanceof Error) {
    res.sendStatus(500);
  } else {
    res.status(201).json(newPost);
  }
};
