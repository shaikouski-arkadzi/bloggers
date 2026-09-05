import { ObjectId } from "mongodb";
import { db } from "../../db";
import { Comment, CommentDb, CommentInputModel } from "../types";
import { mapCommentToCommentDB } from "../utils";

export const commentsCommandRepository = {
  async create(
    comment: Omit<Comment, "id">,
    postId: string,
  ): Promise<ObjectId> {
    const commentDB = mapCommentToCommentDB(comment, postId);

    const result = await db
      .getCollections()
      .commentsCollection.insertOne(commentDB);

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
