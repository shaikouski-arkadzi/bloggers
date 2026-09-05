import { ObjectId } from "mongodb";
import { db } from "../../db";
import { CommentDb, CommentInputModel } from "../types";

export const commentsCommandRepository = {
  async create(comment: CommentDb): Promise<ObjectId> {
    const result = await db
      .getCollections()
      .commentsCollection.insertOne(comment);

    return result.insertedId;
  },

  async update(id: string, comment: CommentInputModel): Promise<void> {
    await db.getCollections().commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: comment,
      },
    );
  },

  async delete(id: string): Promise<void> {
    await db
      .getCollections()
      .commentsCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
