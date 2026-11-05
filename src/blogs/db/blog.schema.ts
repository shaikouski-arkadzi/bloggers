import { Schema } from "mongoose";
import { BlogDb } from "../types";

export const blogSchema = new Schema<BlogDb>({
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
