import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { Types } from "mongoose";
import { LikeModel } from "../db/like.model";
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
  ): Promise<Types.ObjectId> {
    const likeDB = mapLikeModelToLikeDB({
      userId,
      commentId,
      like: likeStatus,
    });

    const likeModel = new LikeModel(likeDB);

    const result = await likeModel.save();

    return result._id;
  }

  async updateLikeStatus(
    userId: string,
    commentId: string,
    likeStatus: TLikeStatus,
  ): Promise<void> {
    await LikeModel.updateOne(
      {
        userId: new Types.ObjectId(userId),
        commentId: new Types.ObjectId(commentId),
      },
      {
        $set: { like: likeStatusToBoolean(likeStatus) },
      },
    );
  }

  async deleteLikeStatus(userId: string, commentId: string): Promise<void> {
    await LikeModel.deleteOne({
      userId: new Types.ObjectId(userId),
      commentId: new Types.ObjectId(commentId),
    });
  }

  async increaseLike(id: string): Promise<void> {
    await LikeModel.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { "likesInfo.likesCount": 1 } },
    );
  }

  async increaseDislike(id: string): Promise<void> {
    await LikeModel.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { "likesInfo.dislikesCount": 1 } },
    );
  }

  async decreaseLike(id: string): Promise<void> {
    await LikeModel.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { "likesInfo.likesCount": -1 } },
    );
  }

  async decreaseDislike(id: string): Promise<void> {
    await LikeModel.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { "likesInfo.dislikesCount": -1 } },
    );
  }
}
