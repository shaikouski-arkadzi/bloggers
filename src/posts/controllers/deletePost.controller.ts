import { Request, Response } from "express";
import { postRepository } from "../repositories";

export const deletePost = (
  req: Request<{ id: string }>,
  res: Response<null>,
) => {
  const { id } = req.params;

  const result = postRepository.delete(id);

  if (result) {
    return res.sendStatus(204);
  }
};
