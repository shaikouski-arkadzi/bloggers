import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { Types } from "mongoose";
import { db } from "../../db";
import { CommentModel } from "../db/comment.model";
import { Comment, CommentInputModel, TLikeStatus } from "../types";
import {
  likeStatusToBoolean,
  mapCommentToCommentDB,
  mapLikeModelToLikeDB,
} from "../utils";

@injectable()
export class CommentsCommandRepository {
  async create(
    comment: Omit<Comment, "id">,
    postId: string,
  ): Promise<Types.ObjectId> {
    const commentDB = mapCommentToCommentDB(comment, postId);

    const commentModel = new CommentModel(commentDB);

    const result = await commentModel.save();

    return result._id;
  }

  async update(comment: any): Promise<void> {
    await comment.save();
  }

  async save(comment: any): Promise<Types.ObjectId> {
    const result = await comment.save();

    return result._id;
  }

  async delete(id: string): Promise<void> {
    await CommentModel.findByIdAndDelete(id);
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

  async updateLikeStatus(
    userId: string,
    commentId: string,
    likeStatus: TLikeStatus,
  ): Promise<void> {
    await db.getCollections().likesCollection.updateOne(
      {
        userId: new ObjectId(userId),
        commentId: new ObjectId(commentId),
      },
      {
        $set: { like: likeStatusToBoolean(likeStatus) },
      },
    );
  }

  async deleteLikeStatus(userId: string, commentId: string): Promise<void> {
    await db.getCollections().likesCollection.deleteOne({
      userId: new ObjectId(userId),
      commentId: new ObjectId(commentId),
    });
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
