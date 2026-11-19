import { HydratedDocument, Model, model } from "mongoose";
import { LikeDb, TLikeStatus } from "../types";
import { likeCommentSchema } from "./likeComment.schema";
import { LikeCommentEntity } from "../domain/LikeComment.entity";

export interface LikeCommentMethods {
  updateLikeStatus(newLikeStatus: TLikeStatus): void;
}

type LikeCommentStatics = typeof LikeCommentEntity;

export type TLikeCommentModel = Model<LikeDb, {}, LikeCommentMethods> &
  LikeCommentStatics;

export type LikeCommentDocument = HydratedDocument<LikeDb, LikeCommentMethods>;

likeCommentSchema.loadClass(LikeCommentEntity);

export const LikeCommentModel = model<LikeDb, TLikeCommentModel>(
  "LikeComment",
  likeCommentSchema,
);
