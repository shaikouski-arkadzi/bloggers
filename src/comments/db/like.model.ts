import { Schema, model } from "mongoose";
import { LikeDb } from "../types";

const likeSchema = new Schema<LikeDb>({
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

export const LikeModel = model<LikeDb>("Like", likeSchema);
