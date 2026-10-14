import { WithId } from "mongodb";
import { Comment, CommentDb } from "../types";
import { INITIAL_LIKES_INFO } from "../constants";

export const mapCommentDbToComment = (
  commentDb: WithId<CommentDb>,
): Comment => ({
  id: commentDb._id.toString(),
  content: commentDb.content,
  commentatorInfo: {
    userId: commentDb.commentatorInfo.userId.toString(),
    userLogin: commentDb.commentatorInfo.userLogin,
  },
  createdAt: commentDb.createdAt,
  likesInfo: {
    likesCount: commentDb.likesInfo.likesCount,
    dislikesCount: commentDb.likesInfo.dislikesCount,
    myStatus: INITIAL_LIKES_INFO.myStatus,
  },
});
