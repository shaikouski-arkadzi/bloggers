import { BlogDb } from "../../blogs/types";
import { INITIAL_LIKES_INFO } from "../../common/constants";
import { LikesInfoDB } from "../../common/types";
import { PostDocument, PostModel } from "../db/post.model";
import { PostInputDto } from "../types";

export class PostEntity {
  private constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public extendedLikesInfo: LikesInfoDB,
  ) {}

  static createPost(postInput: PostInputDto, blog: BlogDb): PostDocument {
    const post = new PostModel(postInput);

    post.blogName = blog.name;
    post.createdAt = new Date().toISOString();
    post.extendedLikesInfo = INITIAL_LIKES_INFO;
    return post;
  }

  updatePost(input: PostInputDto): void {
    this.title = input.title;
    this.shortDescription = input.shortDescription;
    this.content = input.content;
  }

  increaseLikeCount(): void {
    this.extendedLikesInfo.likesCount += 1;
  }

  decreaseLikeCount(): void {
    this.extendedLikesInfo.likesCount -= 1;
  }

  increaseDislikeCount(): void {
    this.extendedLikesInfo.dislikesCount += 1;
  }

  decreaseDislikeCount(): void {
    this.extendedLikesInfo.dislikesCount -= 1;
  }
}
