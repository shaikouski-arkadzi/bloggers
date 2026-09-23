import { Request, Response } from "express";
import { APIErrorResult } from "../../common/types";
import {
  NotFoundException,
  PermissionException,
} from "../../common/exceptions";
import { commentsService } from "../application";
import { UnauthorizedException } from "../../auth/exceptions";

export const deleteComment = async (
  req: Request<{ id: string }>,
  res: Response<APIErrorResult | null>,
) => {
  try {
    const commentId = req.params.id;
    const userId = req.userId;

    if (!userId) throw new UnauthorizedException();

    await commentsService.delete(userId, commentId);

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(404);
    }
    if (error instanceof UnauthorizedException) {
      return res.sendStatus(401);
    }
    if (error instanceof PermissionException) {
      return res.sendStatus(403);
    }
    return res.sendStatus(500);
  }
};
