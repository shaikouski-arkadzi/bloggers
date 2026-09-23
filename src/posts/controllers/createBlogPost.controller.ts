import { Request, Response } from "express";
import { APIErrorResult } from "../../common/types";
import { Post, PostInputDto } from "../../posts/types";
import { postsService } from "../../posts/application/posts.service";
import { NotFoundException } from "../../common/exceptions";
import { postsQueryRepository } from "../../posts/repositories";
import { BlogForPostNotExistException, SavingException } from "../exceptions";

type RequestBody = Omit<PostInputDto, "blogId">;

export const createBlogPost = async (
  req: Request<{ id: string }, {}, RequestBody>,
  res: Response<Post | APIErrorResult>,
) => {
  try {
    const blogId = req.params.id;
    const post = req.body;

    const payload: PostInputDto = {
      ...post,
      blogId,
    };

    const createdPostId = await postsService.create(payload);

    const createdPost = await postsQueryRepository.findById(createdPostId);

    if (!createdPost) throw new SavingException();

    return res.status(201).json(createdPost);
  } catch (error) {
    if (
      error instanceof NotFoundException ||
      error instanceof BlogForPostNotExistException
    ) {
      return res.sendStatus(404);
    }

    return res.sendStatus(500);
  }
};
