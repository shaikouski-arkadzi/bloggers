import { Request, Response } from "express";
import { Post } from "../types";
import { postsService } from "../application/posts.service";

export const getPost = async (
  req: Request<{ id: string }>,
  res: Response<Post | null>,
) => {
  const { id } = req.params;
  const post = await postsService.findById(id);
  if (post) {
    res.status(200).json(post);
  }
};
