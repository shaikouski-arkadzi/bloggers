import { Blog } from "../../blogs/types";
import { PostInputDto, UpdatedPost } from "../types";

export const updatePostDb = (post: PostInputDto, blog: Blog): UpdatedPost => ({
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  blogId: post.blogId,
  blogName: blog.name,
});
