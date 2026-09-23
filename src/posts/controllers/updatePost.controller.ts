import { Request, Response } from "express";
import { PostInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { postsService } from "../application/posts.service";
import { NotFoundException } from "../../common/exceptions";
import { BlogForPostNotExistException } from "../exceptions";

export const updatePost = async (
  req: Request<{ id: string }, {}, PostInputDto>,
  res: Response<APIErrorResult | null>,
) => {
  try {
    const post = req.body;
    const { id } = req.params;

    await postsService.update(id, post);

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(404);
    }
    if (error instanceof BlogForPostNotExistException) {
      return res.status(400).json({
        errorsMessages: [
          {
            message: "Не найдено блога с таким идентификатором",
            field: "blogId",
          },
        ],
      });
    }

    return res.sendStatus(500);
  }
};
