import { NextFunction, Request, Response } from "express";
import { blogRepository } from "../repositories";

export const blogExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  if (typeof id === "string") {
    const blog = await blogRepository.findById(id);

    if (!blog) {
      res.sendStatus(404);
      return;
    }

    next();
  }
};
