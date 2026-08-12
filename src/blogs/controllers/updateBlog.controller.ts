import { Request, Response } from "express";
import { BlogInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { blogsService } from "../application/blogs.service";

export const updateBlog = async (
  req: Request<{ id: string }, {}, BlogInputDto>,
  res: Response<APIErrorResult | null>,
) => {
  const blogData = req.body;
  const { id } = req.params;

  const result = await blogsService.update(id, blogData);

  if (result) {
    res.sendStatus(204);
  }
};
