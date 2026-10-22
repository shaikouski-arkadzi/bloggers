import { Schema, model } from "mongoose";
import { PostDb } from "../types";

const postSchema = new Schema<PostDb>({
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
});

export const PostModel = model<PostDb>("Post", postSchema);
