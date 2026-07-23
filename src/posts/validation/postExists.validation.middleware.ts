import { NextFunction, Request, Response } from "express";
import { postRepository } from "../repositories";

export const postExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  if (typeof id === "string") {
    const post = await postRepository.findById(id);

    if (!post) {
      res.sendStatus(404);
      return;
    }

    next();
  }
};
