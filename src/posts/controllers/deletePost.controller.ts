import { Request, Response } from "express";
import { postsService } from "../application/posts.service";

export const deletePost = async (
  req: Request<{ id: string }>,
  res: Response<null>,
) => {
  const { id } = req.params;

  const result = await postsService.delete(id);

  if (result) {
    return res.sendStatus(204);
  }
};
