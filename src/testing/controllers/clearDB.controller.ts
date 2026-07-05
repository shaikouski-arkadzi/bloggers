import { Request, Response } from "express";
import { db } from "../../db";

export const clearDB = (_: Request, res: Response<null>) => {
  db.blogs.length = 0;
  db.posts.length = 0;
  res.sendStatus(204);
};
