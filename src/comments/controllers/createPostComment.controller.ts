import { Request, Response } from "express";
import { APIErrorResult } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";
import { Comment, CommentInputModel } from "../types";
import { commentsService } from "../application";
import { UnauthorizedException } from "../../auth/exceptions";
import { commentsQueryRepository } from "../repositories";

export const createPostComment = async (
  req: Request<{ id: string }, {}, CommentInputModel>,
  res: Response<Comment | APIErrorResult>,
) => {
  try {
    const postId = req.params.id;
    const comment = req.body;
    const { userId } = req.auth;

    if (!userId) throw new UnauthorizedException();

    const { content } = comment;

    const newCommentId = await commentsService.create(userId, postId, content);

    const newComment = await commentsQueryRepository.findByField({
      _id: newCommentId,
    });

    if (newComment) return res.status(201).json(newComment);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(404);
    }
    if (error instanceof UnauthorizedException) {
      return res.sendStatus(401);
    }
    return res.sendStatus(500);
  }
};
