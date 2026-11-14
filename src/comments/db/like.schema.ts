import { Schema } from "mongoose";
import { LikeDb } from "../types";

export const likeSchema = new Schema<LikeDb>({
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
