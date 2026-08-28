import { ObjectId } from "mongodb";
import { db } from "../../db";
import { CommentDb } from "../types";

export const commentsCommandRepository = {
  async create(comment: CommentDb): Promise<ObjectId> {
    const result = await db
      .getCollections()
      .commentsCollection.insertOne(comment);

    return result.insertedId;
  },
};
