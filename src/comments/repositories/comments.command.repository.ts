import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { Types } from "mongoose";
import { LikeModel } from "../db/like.model";
import { CommentModel } from "../db/comment.model";
import { Comment, CommentDb, CommentInputModel, TLikeStatus } from "../types";
import {
  likeStatusToBoolean,
  mapCommentToCommentDB,
  mapLikeModelToLikeDB,
} from "../utils";
import { NotFoundException } from "../../common/exceptions";

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

  async findById(id: string): Promise<any | null> {
    const result = await CommentModel.findById(id);

    if (!result) {
      return null;
    }

    return result;
  }

  async findLikeByUserAndComment(
    userId: string,
    commentId: string,
  ): Promise<any | null> {
    const result = await LikeModel.findOne({
      userId: new Types.ObjectId(userId),
      commentId: new Types.ObjectId(commentId),
    });

    if (!result) {
      return null;
    }

    return result;
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
}
