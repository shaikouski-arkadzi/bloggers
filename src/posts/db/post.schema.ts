import { Schema } from "mongoose";
import { PostDb } from "../types";

export const postSchema = new Schema<PostDb>({
  title: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  blogId: {
    type: String,
    required: true,
  },
  blogName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  extendedLikesInfo: {
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
