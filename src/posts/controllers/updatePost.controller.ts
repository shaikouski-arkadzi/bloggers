import { Request, Response } from "express";
import { PostInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { postsService } from "../application/posts.service";

export const updatePost = async (
  req: Request<{ id: string }, {}, PostInputDto>,
  res: Response<APIErrorResult | null>,
) => {
  const post = req.body;
  const { id } = req.params;

  const result = await postsService.update(id, post);

  if (result) res.sendStatus(204);
};
