import { Request, Response } from "express";
import { db } from "../../db";
import { Post } from "../types";

export const getPosts = (_req: Request, res: Response<Post[]>) => {
  res.status(200).json(db.posts);
};
