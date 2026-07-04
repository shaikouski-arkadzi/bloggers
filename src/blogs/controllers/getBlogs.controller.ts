import { Request, Response } from "express";
import { db } from "../../db";
import { Blog } from "../types";

export const getBlogs = (_req: Request, res: Response<Blog[]>) => {
  res.status(200).json(db.blogs);
};
