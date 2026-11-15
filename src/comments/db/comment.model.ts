import { HydratedDocument, Model, model } from "mongoose";
import { CommentDb } from "../types";
import { commentSchema } from "./comment.schema";
import { CommentEntity } from "../domain/Comment.entity";

export interface CommentMethods {
  updateCommentContent(newContent: string): void;
}

type CommentStatics = typeof CommentEntity;

export type TCommentModel = Model<CommentDb, {}, CommentMethods> &
  CommentStatics;

export type CommentDocument = HydratedDocument<CommentDb, CommentMethods>;

commentSchema.loadClass(CommentEntity);

export const CommentModel = model<CommentDb, TCommentModel>(
  "Comment",
  commentSchema,
);
