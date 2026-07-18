import { NextFunction, Request, Response } from "express";
import { db } from "../../db";

export const postExistsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const postIndex = db.posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    res.sendStatus(404);
    return;
  }

  next();
};
