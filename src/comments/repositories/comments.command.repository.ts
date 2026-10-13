import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { db } from "../../db";
import { Comment, CommentInputModel, TLikeStatus } from "../types";
import { mapCommentToCommentDB, mapLikeModelToLikeDB } from "../utils";

@injectable()
export class CommentsCommandRepository {
  async create(
    comment: Omit<Comment, "id">,
    postId: string,
  ): Promise<ObjectId> {
    const commentDB = mapCommentToCommentDB(comment, postId);

    const result = await db
      .getCollections()
      .commentsCollection.insertOne(commentDB);

    return result.insertedId;
  }

  async update(id: string, comment: CommentInputModel): Promise<void> {
    await db.getCollections().commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: comment,
      },
    );
  }

  async delete(id: string): Promise<void> {
    await db
      .getCollections()
      .commentsCollection.deleteOne({ _id: new ObjectId(id) });
  }

  async createLike(
    userId: string,
    commentId: string,
    likeStatus: TLikeStatus,
  ): Promise<ObjectId> {
    const commentDB = mapLikeModelToLikeDB({
      userId,
      commentId,
      like: likeStatus,
    });

    const result = await db
      .getCollections()
      .likesCollection.insertOne(commentDB);

    return result.insertedId;
  }

  async increaseLike(id: string): Promise<void> {
    await db
      .getCollections()
      .commentsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { "likesInfo.likesCount": 1 } },
      );
  }

  async increaseDislike(id: string): Promise<void> {
    await db
      .getCollections()
      .commentsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { "likesInfo.dislikesCount": 1 } },
      );
  }

  async decreaseLike(id: string): Promise<void> {
    await db
      .getCollections()
      .commentsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { "likesInfo.likesCount": -1 } },
      );
  }

  async decreaseDislike(id: string): Promise<void> {
    await db
      .getCollections()
      .commentsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { "likesInfo.dislikesCount": -1 } },
      );
  }
}
