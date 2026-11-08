import { BlogDb } from "../../blogs/types";
import { PostDocument, PostModel } from "../db/post.model";
import { PostInputDto } from "../types";

export class PostEntity {
  static createPost(postInput: PostInputDto, blog: BlogDb): PostDocument {
    const post = new PostModel(postInput);

    post.blogName = blog.name;
    post.createdAt = new Date().toISOString();

    return post;
  }
}
