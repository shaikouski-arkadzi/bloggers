import { Request, Response } from "express";
import { BlogInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { blogsService } from "../application/blogs.service";
import { NotFoundException } from "../../common/exceptions";

export const updateBlog = async (
  req: Request<{ id: string }, {}, BlogInputDto>,
  res: Response<APIErrorResult | null>,
) => {
  try {
    const blogData = req.body;
    const { id } = req.params;

    await blogsService.update(id, blogData);

    res.sendStatus(204);
  } catch (error) {
    if (error instanceof NotFoundException) {
      res.sendStatus(404);
    }
  }
};
