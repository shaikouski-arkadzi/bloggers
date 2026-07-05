import { Request, Response } from "express";
import { db } from "../../db";

export const deleteBlog = (
  req: Request<{ id: string }>,
  res: Response<null>,
) => {
  const { id } = req.params;

  const index = db.blogs.findIndex((blog) => blog.id === id);

  if (index === -1) {
    return res.sendStatus(404);
  }

  db.blogs.splice(index, 1);

  return res.sendStatus(204);
};
