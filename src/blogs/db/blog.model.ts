import { Schema, model } from "mongoose";
import { BlogDb } from "../types";

const blogSchema = new Schema<BlogDb>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    required: true,
  },
  isMembership: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

export const BlogModel = model<BlogDb>("Blog", blogSchema);
