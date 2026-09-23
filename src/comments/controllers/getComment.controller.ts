import { Request, Response } from "express";
import { NotFoundException } from "../../common/exceptions";
import { Comment } from "../types";
import { commentsService } from "../application";

export const getComment = async (
  req: Request<{ id: string }>,
  res: Response<Comment>,
) => {
  try {
    const { id } = req.params;

    const result = await commentsService.getCommentById(id);

    if (!result) throw new NotFoundException();

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(404);
    }
    return res.sendStatus(500);
  }
};
