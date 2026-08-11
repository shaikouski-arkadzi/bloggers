import { Request, Response } from "express";
import { APIErrorResult } from "../../common/types";
import { postRepository } from "../../posts/repositories";
import { Post, PostInputDto } from "../../posts/types";

type RequestBody = Omit<PostInputDto, "blogId">;

export const createBlogPost = async (
  req: Request<{ id: string }, {}, RequestBody>,
  res: Response<Post | APIErrorResult>,
) => {
  const blogId = req.params.id;
  const post = req.body;

  const payload: PostInputDto = {
    ...post,
    blogId,
  };

  const newPost = await postRepository.create(payload);

  res.status(201).json(newPost);
};
