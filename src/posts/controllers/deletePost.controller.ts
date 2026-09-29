import { Request, Response } from "express";
import { NotFoundException } from "../../common/exceptions";
import { postsService } from "../composition-root";

export const deletePost = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    await postsService.delete(id);

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(404);
    }

    return res.sendStatus(500);
  }
};
