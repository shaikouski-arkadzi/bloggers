import { User } from "../../users/types";
import { CommentDocument, CommentModel } from "../db/comment.model";
import { createCommentDb } from "../utils";

export class CommentEntity {
  private constructor(public content: string) {}

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
}
