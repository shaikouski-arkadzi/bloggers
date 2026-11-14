import { Types } from "mongoose";
import { CommentDb } from "../types";
import { User } from "../../users/types";
import { INITIAL_LIKES_INFO } from "../constants";

export const createCommentDb = (
  commentContent: string,
  user: User,
  postId: string,
): CommentDb => ({
  content: commentContent,
  commentatorInfo: {
    userId: new Types.ObjectId(user.id),
    userLogin: user.login,
  },
  createdAt: new Date().toISOString(),
  postId: new Types.ObjectId(postId),
  likesInfo: INITIAL_LIKES_INFO,
});
