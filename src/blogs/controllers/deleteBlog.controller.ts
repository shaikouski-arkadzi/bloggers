import { Request, Response } from "express";
import { blogRepository } from "../repositories";

export const deleteBlog = async (
  req: Request<{ id: string }>,
  res: Response<null>,
) => {
  const { id } = req.params;
  const result = await blogRepository.delete(id);

  if (result) {
    return res.sendStatus(204);
  }
};
