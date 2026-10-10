import { ObjectId } from "mongodb";
import { Comment, CommentDb } from "../types";

export const mapCommentToCommentDB = (
  comment: Omit<Comment, "id">,
  postId: string,
): CommentDb => ({
  content: comment.content,
  commentatorInfo: {
    userId: new ObjectId(comment.commentatorInfo.userId),
    userLogin: comment.commentatorInfo.userLogin,
  },
  createdAt: comment.createdAt,
  postId: new ObjectId(postId),
  likesInfo: {
    likesCount: comment.likesInfo.likesCount,
    dislikesCount: comment.likesInfo.dislikesCount,
    myStatus: comment.likesInfo.myStatus,
  },
});
