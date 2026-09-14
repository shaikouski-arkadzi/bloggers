import { Request, Response } from "express";
import { blogsService } from "../application/blogs.service";
import { NotFoundException } from "../../common/exceptions";

export const deleteBlog = async (
  req: Request<{ id: string }>,
  res: Response<null>,
) => {
  try {
    const { id } = req.params;

    await blogsService.delete(id);

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof NotFoundException) {
      res.sendStatus(404);
    }
  }
};
