import { injectable } from "inversify";
import { Types } from "mongoose";
import { LikeCommentDocument, LikeCommentModel } from "../db/likeComment.model";
import { CommentDocument, CommentModel } from "../db/comment.model";

@injectable()
export class CommentsCommandRepository {
  async update(comment: CommentDocument): Promise<void> {
    await comment.save();
  }

  async saveComment(comment: CommentDocument): Promise<Types.ObjectId> {
    const result = await comment.save();

    return result._id;
  }

  async delete(id: string): Promise<void> {
    await CommentModel.findByIdAndDelete(id);
  }

  async findById(id: string): Promise<CommentDocument | null> {
    const result = await CommentModel.findById(id);

    if (!result) {
      return null;
    }

    return result;
  }

  async findLikeStatusByUserAndComment(
    userId: string,
    commentId: string,
  ): Promise<LikeCommentDocument | null> {
    const result = await LikeCommentModel.findOne({
      userId: new Types.ObjectId(userId),
      commentId: new Types.ObjectId(commentId),
    });

    if (!result) {
      return null;
    }

    return result;
  }

  async saveLike(likeModel: LikeCommentDocument): Promise<Types.ObjectId> {
    const result = await likeModel.save();

    return result._id;
  }

  async deleteLikeStatus(userId: string, commentId: string): Promise<void> {
    await LikeCommentModel.deleteOne({
      userId: new Types.ObjectId(userId),
      commentId: new Types.ObjectId(commentId),
    });
  }
}
