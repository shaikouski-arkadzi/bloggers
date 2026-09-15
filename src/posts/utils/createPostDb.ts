import { Blog } from "../../blogs/types";
import { PostDb, PostInputDto } from "../types";

export const createPostDb = (post: PostInputDto, blog: Blog): PostDb => ({
  title: post.title,
  content: post.content,
  shortDescription: post.shortDescription,
  blogId: post.blogId,
  blogName: blog.name,
  createdAt: new Date().toISOString(),
});
