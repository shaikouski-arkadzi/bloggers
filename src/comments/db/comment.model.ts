import { Schema, model } from "mongoose";
import { CommentDb } from "../types";

const commentSchema = new Schema<CommentDb>({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  commentatorInfo: {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userLogin: {
      type: String,
      required: true,
    },
  },
  likesInfo: {
    likesCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    dislikesCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
});

export const CommentModel = model<CommentDb>("Comment", commentSchema);
