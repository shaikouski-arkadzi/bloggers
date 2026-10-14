import { WithId } from "mongodb";
import { Comment, CommentDb, TLikeStatus } from "../types";

export const mapCommentWithMyStatus = (
  comment: WithId<CommentDb>,
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
