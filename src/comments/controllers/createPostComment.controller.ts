import { Request, Response } from "express";
import { APIErrorResult } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";
import { Comment, CommentInputModel } from "../types";
import { commentsService } from "../application";
import { UnauthorizedException } from "../../auth/exceptions";

export const createPostComment = async (
  req: Request<{ id: string }, {}, CommentInputModel>,
  res: Response<Comment | APIErrorResult>,
) => {
  try {
    const postId = req.params.id;
    const comment = req.body;
    const userId = req.userId;

    if (!userId) throw new UnauthorizedException();

    const { content } = comment;

    const newComment = await commentsService.create(userId, postId, content);

    if (newComment) res.status(201).json(newComment);
  } catch (error) {
    if (error instanceof NotFoundException) {
      res.sendStatus(404);
    }
    if (error instanceof UnauthorizedException) {
      res.sendStatus(401);
    }
  }
};
