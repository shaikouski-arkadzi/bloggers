import { Request, Response } from "express";
import { Post, PostInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { postRepository } from "../repositories";

export const createPost = async (
  req: Request<{}, {}, PostInputDto>,
  res: Response<Post | APIErrorResult>,
) => {
  const post = req.body;

  const newPost = await postRepository.create(post);

  res.status(201).json(newPost);
};
