import { User } from "../../users/types";
import { CommentDocument, CommentModel } from "../db/comment.model";
import { Comment } from "../types";
import { createCommentDb } from "../utils";

export class CommentEntity {
  static createComment(
    commentContent: string,
    user: User,
    postId: string,
  ): CommentDocument {
    const commentObject = createCommentDb(commentContent, user, postId);

    const commentModel = new CommentModel(commentObject);

    return commentModel;
  }
}
