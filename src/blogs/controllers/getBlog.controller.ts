import { Request, Response } from "express";
import { Blog } from "../types";
import { blogRepository } from "../repositories";

export const getBlog = (
  req: Request<{ id: string }>,
  res: Response<Blog | null>,
) => {
  const { id } = req.params;

  const result = blogRepository.findById(id);

  if (result) {
    res.status(200).json(result);
  }
};
