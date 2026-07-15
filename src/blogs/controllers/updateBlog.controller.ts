import { Request, Response } from "express";
import { BlogInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { blogRepository } from "../repositories";

export const updateBlog = (
  req: Request<{ id: string }, {}, BlogInputDto>,
  res: Response<APIErrorResult | null>,
) => {
  const blogData = req.body;
  const { id } = req.params;

  const result = blogRepository.update(id, blogData);

  if (!result) {
    return res.sendStatus(404);
  } else {
    res.sendStatus(204);
  }
};
