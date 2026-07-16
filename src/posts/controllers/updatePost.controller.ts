import { Request, Response } from "express";
import { PostInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { postRepository } from "../repositories";

export const updatePost = (
  req: Request<{ id: string }, {}, PostInputDto>,
  res: Response<APIErrorResult | null>,
) => {
  const post = req.body;
  const { id } = req.params;

  const result = postRepository.update(id, post);

  if (!result) {
    return res.sendStatus(404);
  }

  res.sendStatus(204);
};
