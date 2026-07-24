import { Request, Response } from "express";
import { blogsCollection, postsCollection } from "../../db";

export const clearDB = async (_req: Request, res: Response<null>) => {
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});
  res.sendStatus(204);
};
