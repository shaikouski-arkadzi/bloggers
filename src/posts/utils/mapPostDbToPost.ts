import { Post, PostDb } from "../types";

export const mapPostDbToPost = (postDb: PostDb): Post => ({
  id: postDb._id.toString(),
  title: postDb.title,
  content: postDb.content,
  shortDescription: postDb.content,
  blogId: postDb.blogId,
  blogName: postDb.blogName,
  createdAt: postDb.createdAt,
});
