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

    return res.status(200).json(post);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(404);
    }

    return res.sendStatus(500);
  }
};
