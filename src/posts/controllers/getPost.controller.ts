import { Request, Response } from "express";
import { Post } from "../types";
import { postsService } from "../application/posts.service";
import { NotFoundException } from "../../common/exceptions";

export const getPost = async (
  req: Request<{ id: string }>,
  res: Response<Post | null>,
) => {
  try {
    const { id } = req.params;
    const post = await postsService.findById(id);
    if (post) {
      res.status(200).json(post);
    }
  } catch (error) {
    if (error instanceof NotFoundException) {
      res.sendStatus(404);
    }
  }
};
