import { Request, Response } from "express";
import { Post } from "../types";
import { postRepository } from "../repositories";

export const getPost = (
  req: Request<{ id: string }>,
  res: Response<Post | null>,
) => {
  const { id } = req.params;
  const post = postRepository.findById(id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.sendStatus(404);
  }
};
