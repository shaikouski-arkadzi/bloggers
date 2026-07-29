import { Request, Response } from "express";
import { db } from "../../db";

export const clearDB = async (_req: Request, res: Response<null>) => {
  await db.getCollections().blogsCollection.deleteMany({});
  await db.getCollections().postsCollection.deleteMany({});

  res.sendStatus(204);
};
