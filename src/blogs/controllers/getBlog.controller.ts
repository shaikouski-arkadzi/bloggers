import { Request, Response } from "express";
import { Blog } from "../types";
import { NotFoundException } from "../../common/exceptions";
import { blogsService } from "../composition-root";

export const getBlog = async (
  req: Request<{ id: string }>,
  res: Response<Blog | null>,
) => {
  try {
    const { id } = req.params;

    const result = await blogsService.findById(id);

    if (result) {
      return res.status(200).json(result);
    }
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(404);
    }

    return res.sendStatus(500);
  }
};
