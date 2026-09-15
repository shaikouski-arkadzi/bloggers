import { Request, Response } from "express";
import { Post, PostInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { postsService } from "../application/posts.service";
import { BlogForPostNotExistException, SavingException } from "../exceptions";
import { postsQueryRepository } from "../repositories";

export const createPost = async (
  req: Request<{}, {}, PostInputDto>,
  res: Response<Post | APIErrorResult>,
) => {
  try {
    const post = req.body;

    const createdPostId = await postsService.create(post);

    const createdPost = await postsQueryRepository.findById(createdPostId);

    if (!createdPost) throw new SavingException();

    res.status(201).json(createdPost);
  } catch (error) {
    if (error instanceof BlogForPostNotExistException) {
      res.status(400).json({
        errorsMessages: [
          {
            message: "Не найдено блога с таким идентификатором",
            field: "blogId",
          },
        ],
      });
    }
  }
};
