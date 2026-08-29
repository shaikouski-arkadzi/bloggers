import { Request, Response } from "express";
import { CommentInputModel } from "../types";
import { APIErrorResult } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";
import { commentsService } from "../application";
import { UnauthorizedException } from "../../auth/exceptions";
import { PermissionException } from "../exceptions";

export const updateComment = async (
  req: Request<{ id: string }, {}, CommentInputModel>,
  res: Response<APIErrorResult | null>,
) => {
  try {
    const comment = req.body;
    const commentId = req.params.id;
    const userId = req.userId;

    if (!userId) throw new UnauthorizedException();

    const result = await commentsService.update(userId, commentId, comment);

    if (result) {
      res.sendStatus(204);
    } else {
      throw new NotFoundException();
    }
  } catch (error) {
    if (error instanceof NotFoundException) {
      res.sendStatus(404);
    }
    if (error instanceof UnauthorizedException) {
      res.sendStatus(401);
    }
    if (error instanceof PermissionException) {
      res.sendStatus(403);
    }
  }
};
