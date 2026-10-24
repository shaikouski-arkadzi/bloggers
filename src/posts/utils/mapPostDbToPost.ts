import { Types } from "mongoose";
import { Post, PostDb } from "../types";

export const mapPostDbToPost = (
  postDb: PostDb & { _id: Types.ObjectId },
): Post => ({
  id: postDb._id.toString(),
  title: postDb.title,
  content: postDb.content,
  shortDescription: postDb.shortDescription,
  blogId: postDb.blogId,
  blogName: postDb.blogName,
  createdAt: postDb.createdAt,
});
