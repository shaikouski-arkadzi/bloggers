import { User } from "../../users/types";
import { CommentDocument, CommentModel } from "../db/comment.model";
import { LikesInfoDB } from "../../common/types";
import { createCommentDb } from "../utils";

export class CommentEntity {
  private constructor(
    public content: string,
    public likesInfo: LikesInfoDB,
  ) {}

  static createComment(
    commentContent: string,
    user: User,
    postId: string,
  ): CommentDocument {
    const commentObject = createCommentDb(commentContent, user, postId);

    const commentModel = new CommentModel(commentObject);

    return commentModel;
  }

  updateCommentContent(newContent: string): void {
    this.content = newContent;
  }

  increaseLikeCount(): void {
    this.likesInfo.likesCount += 1;
  }

  decreaseLikeCount(): void {
    this.likesInfo.likesCount -= 1;
  }

  increaseDislikeCount(): void {
    this.likesInfo.dislikesCount += 1;
  }

  decreaseDislikeCount(): void {
    this.likesInfo.dislikesCount -= 1;
  }
}
