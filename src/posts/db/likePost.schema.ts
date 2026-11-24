import { Schema } from "mongoose";
import { LikePostDb } from "../types";

export const likePostSchema = new Schema<LikePostDb>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  like: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});
