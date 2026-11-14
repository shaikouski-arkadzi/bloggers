import { HydratedDocument, Model, model } from "mongoose";
import { CommentDb } from "../types";
import { commentSchema } from "./comment.schema";
import { CommentEntity } from "../domain/Comment.entity";

type UserStatics = typeof CommentEntity;

export type TCommentModel = Model<CommentDb> & UserStatics;

export type CommentDocument = HydratedDocument<CommentDb>;

commentSchema.loadClass(CommentEntity);

export const CommentModel = model<CommentDb, TCommentModel>(
  "Comment",
  commentSchema,
);
