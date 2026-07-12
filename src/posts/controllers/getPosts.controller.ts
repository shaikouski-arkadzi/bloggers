import { Request, Response } from "express";
import { Post } from "../types";
import { postRepository } from "../repositories";

export const getPosts = (_req: Request, res: Response<Post[]>) => {
  res.status(200).json(postRepository.findAll());
};
