import { NextFunction, Request, Response } from "express";
import { db } from "../../db";

export const blogExistsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const blogIndex = db.blogs.findIndex((b) => b.id === id);

  if (blogIndex === -1) {
    res.sendStatus(404);
    return;
  }

  next();
};
