import { Request, Response } from "express";
import { Post } from "../types";
import { db } from "../../db";

export const getPost = (
  req: Request<{ id: string }>,
  res: Response<Post | null>,
) => {
  const { id } = req.params;
  const result = db.posts.find((post) => post.id === id);
  if (result) {
    res.status(200).json(result);
  } else {
    res.sendStatus(404);
  }
};
