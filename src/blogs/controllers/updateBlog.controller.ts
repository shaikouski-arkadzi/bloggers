import { Request, Response } from "express";
import { BlogInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";
import { blogsService } from "../composition-root";

export const updateBlog = async (
  req: Request<{ id: string }, {}, BlogInputDto>,
  res: Response<APIErrorResult | null>,
) => {
  try {
    const blogData = req.body;
    const { id } = req.params;

    await blogsService.update(id, blogData);

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(404);
    }

    return res.sendStatus(500);
  }
};
