import { Request, Response } from "express";
import { Post } from "../types";
import { postRepository } from "../repositories";

export const getPosts = async (_req: Request, res: Response<Post[]>) => {
  const result = await postRepository.findAll();

  res.status(200).json(result);
};
