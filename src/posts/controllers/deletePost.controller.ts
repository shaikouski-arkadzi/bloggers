import { Request, Response } from "express";
import { db } from "../../db";

export const deletePost = (
  req: Request<{ id: string }>,
  res: Response<null>,
) => {
  const { id } = req.params;

  const index = db.posts.findIndex((post) => post.id === id);

  if (index === -1) {
    return res.sendStatus(404);
  }

  db.posts.splice(index, 1);

  return res.sendStatus(204);
};
