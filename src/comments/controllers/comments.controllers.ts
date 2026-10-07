import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { matchedData } from "express-validator";
import { APIErrorResult, PaginatorData } from "../../common/types";
import {
  NotFoundException,
  PermissionException,
} from "../../common/exceptions";
import { Comment, CommentInputModel, CommentsQuery } from "../types";
import { UnauthorizedException } from "../../auth/exceptions";
import { CommentsService } from "../application/comments.service";
import { CommentsQueryRepository } from "../repositories";

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsService)
    private commentsService: CommentsService,

    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  createPostComment = async (
    req: Request<{ id: string }, {}, CommentInputModel>,
    res: Response<Comment | APIErrorResult>,
  ) => {
    try {
      const postId = req.params.id;
      const { content } = req.body;
      const { userId } = req.auth;

      if (!userId) throw new UnauthorizedException();

      const newCommentId = await this.commentsService.create(
        userId,
        postId,
        content,
      );

      const newComment = await this.commentsQueryRepository.findByField({
        _id: newCommentId,
      });

      if (!newComment) throw new Error();

      return res.status(201).json(newComment);
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

  updateComment = async (
    req: Request<{ id: string }, {}, CommentInputModel>,
    res: Response<APIErrorResult | null>,
  ) => {
    try {
      const comment = req.body;
      const commentId = req.params.id;
      const userId = req.auth.userId;

      if (!userId) throw new UnauthorizedException();

      await this.commentsService.update(userId, commentId, comment);

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

  deleteComment = async (
    req: Request<{ id: string }>,
    res: Response<APIErrorResult | null>,
  ) => {
    try {
      const commentId = req.params.id;
      const userId = req.auth.userId;

      if (!userId) throw new UnauthorizedException();

      await this.commentsService.delete(userId, commentId);

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

  getComment = async (req: Request<{ id: string }>, res: Response<Comment>) => {
    try {
      const { id } = req.params;

      const result = await this.commentsService.getCommentById(id);

      if (!result) throw new NotFoundException();

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.sendStatus(404);
      }

      return res.sendStatus(500);
    }
  };

  getPostComments = async (
    req: Request<{ id: string }, {}, {}, CommentsQuery>,
    res: Response<PaginatorData<Comment>>,
  ) => {
    try {
      const id = req.params.id;

      const commentsQueries = matchedData<CommentsQuery>(req);

      const result = await this.commentsService.findManyByPost(
        id,
        commentsQueries,
      );

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.sendStatus(404);
      }

      return res.sendStatus(500);
    }
  };
}
