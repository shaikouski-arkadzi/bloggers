import { Request, Response } from "express";
import { APIErrorResult } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";
import { Comment, CommentInputModel } from "../types";
import { commentsService } from "../application";

export const createPostComment = async (
  req: Request<{ id: string }, {}, CommentInputModel>,
  res: Response<Comment | APIErrorResult>,
) => {
  try {
    const auth = req.headers["authorization"] as string;
    const postId = req.params.id;
    const comment = req.body;

    const { content } = comment;

    const newComment = await commentsService.create(auth, postId, content);

    if (newComment) res.status(201).json(newComment);
  } catch (error) {
    if (error instanceof NotFoundException) {
      res.sendStatus(404);
    }
    if (error instanceof Error) {
      res.sendStatus(500);
    }
  }
};
