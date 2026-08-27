import { Request, Response } from "express";
import { PaginatorData } from "../../common/types";
import { matchedData } from "express-validator";
import { NotFoundException } from "../../common/exceptions";
import { Comment, CommentsQuery } from "../types";
import { commentsService } from "../application";

export const getPostComments = async (
  req: Request<{ id: string }, {}, {}, CommentsQuery>,
  res: Response<PaginatorData<Comment>>,
) => {
  try {
    const id = req.params.id;

    const commentsQueries = matchedData<CommentsQuery>(req);

    const result = await commentsService.findManyByPost(id, commentsQueries);

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof NotFoundException) {
      res.sendStatus(404);
    }
  }
};
