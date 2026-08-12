import { Request, Response } from "express";
import { blogsService } from "../application/blogs.service";

export const deleteBlog = async (
  req: Request<{ id: string }>,
  res: Response<null>,
) => {
  const { id } = req.params;

  const result = await blogsService.delete(id);

  if (result) {
    return res.sendStatus(204);
  }
};
