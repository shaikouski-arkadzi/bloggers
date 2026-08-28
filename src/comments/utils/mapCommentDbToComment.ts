import { WithId } from "mongodb";
import { Comment, CommentDb } from "../types";

export const mapCommentDbToComment = (
  commentDb: WithId<CommentDb>,
): Comment => ({
  id: commentDb._id.toString(),
  content: commentDb.content,
  commentatorInfo: {
    userId: commentDb.commentatorInfo.userId,
    userLogin: commentDb.commentatorInfo.userLogin,
  },
  createdAt: commentDb.createdAt,
});
