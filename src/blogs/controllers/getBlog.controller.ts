import { Request, Response } from "express";
import { blogsService } from "../application/blogs.service";
import { Blog } from "../types";

export const getBlog = async (
  req: Request<{ id: string }>,
  res: Response<Blog | null>,
) => {
  const { id } = req.params;

  const result = await blogsService.findById(id);

  if (result) {
    res.status(200).json(result);
  }
};
