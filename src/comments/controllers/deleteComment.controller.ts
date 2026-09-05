import { Request, Response } from "express";
import { APIErrorResult } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";
import { commentsService } from "../application";
import { UnauthorizedException } from "../../auth/exceptions";
import { PermissionException } from "../exceptions";

export const deleteComment = async (
  req: Request<{ id: string }>,
  res: Response<APIErrorResult | null>,
) => {
  try {
    const commentId = req.params.id;
    const userId = req.userId;

    if (!userId) throw new UnauthorizedException();

    await commentsService.delete(userId, commentId);

    res.sendStatus(204);
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
