import { Schema } from "mongoose";
import { LikeCommentDb } from "../types";

export const likeCommentSchema = new Schema<LikeCommentDb>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  commentId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  like: {
    type: Boolean,
    required: true,
  },
});
