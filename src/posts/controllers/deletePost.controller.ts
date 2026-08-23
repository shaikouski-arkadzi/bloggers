import { Request, Response } from "express";
import { postsService } from "../application/posts.service";
import { NotFoundException } from "../../common/exceptions";

export const deletePost = async (
  req: Request<{ id: string }>,
  res: Response<null>,
) => {
  try {
    const { id } = req.params;

    const result = await postsService.delete(id);

    if (result) {
      return res.sendStatus(204);
    }
  } catch (error) {
    if (error instanceof NotFoundException) {
      res.sendStatus(404);
    }
  }
};
