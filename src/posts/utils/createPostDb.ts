import { BlogDb } from "../../blogs/types";
import { PostDb, PostInputDto } from "../types";

export const createPostDb = (post: PostInputDto, blog: BlogDb): PostDb => ({
  title: post.title,
  content: post.content,
  shortDescription: post.shortDescription,
  blogId: post.blogId,
  blogName: blog.name,
  createdAt: new Date().toISOString(),
});
