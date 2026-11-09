import { BlogDb } from "../../blogs/types";
import { PostDocument, PostModel } from "../db/post.model";
import { PostInputDto } from "../types";

export class PostEntity {
  private constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
  ) {}

  static createPost(postInput: PostInputDto, blog: BlogDb): PostDocument {
    const post = new PostModel(postInput);

    post.blogName = blog.name;
    post.createdAt = new Date().toISOString();

    return post;
  }

  updatePost(input: PostInputDto): void {
    this.title = input.title;
    this.shortDescription = input.shortDescription;
    this.content = input.content;
  }
}
