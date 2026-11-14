import { CommentDocument, CommentModel } from "../db/comment.model";
import { Comment } from "../types";
import { createCommentDb } from "../utils";

export class CommentEntity {
  static createComment(
    comment: Omit<Comment, "id">,
    postId: string,
  ): CommentDocument {
    const commentObject = createCommentDb(comment, postId);

    const commentModel = new CommentModel(commentObject);

    return commentModel;
  }
}
