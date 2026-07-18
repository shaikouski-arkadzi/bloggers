import { Request, Response } from "express";
import { blogRepository } from "../repositories";

export const deleteBlog = (
  req: Request<{ id: string }>,
  res: Response<null>,
) => {
  const { id } = req.params;
  const result = blogRepository.delete(id);

  if (result) {
    return res.sendStatus(204);
  }
};
