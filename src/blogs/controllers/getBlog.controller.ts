import { Request, Response } from "express";
import { Blog } from "../types";
import { db } from "../../db";

export const getBlog = (
  req: Request<{ id: string }>,
  res: Response<Blog | null>,
) => {
  const { id } = req.params;
  const result = db.blogs.find((blog) => blog.id === id);
  if (result) {
    res.status(200).json(result);
  } else {
    res.sendStatus(404);
  }
};
