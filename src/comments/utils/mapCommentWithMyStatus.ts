import { Types } from "mongoose";
import { Comment, CommentDb, TLikeStatus } from "../types";

export const mapCommentWithMyStatus = (
  comment: CommentDb & { _id: Types.ObjectId },
  myLikeStatus: TLikeStatus,
): Comment => ({
  id: comment._id.toString(),
  content: comment.content,
  createdAt: comment.createdAt,
  commentatorInfo: {
    userId: comment.commentatorInfo.userId.toString(),
    userLogin: comment.commentatorInfo.userLogin,
  },
  likesInfo: {
    likesCount: comment.likesInfo.likesCount,
    dislikesCount: comment.likesInfo.dislikesCount,
    myStatus: myLikeStatus,
  },
});
