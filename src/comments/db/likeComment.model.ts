import { HydratedDocument, Model, model } from "mongoose";
import { LikeCommentDb } from "../types";
import { likeCommentSchema } from "./likeComment.schema";
import { LikeCommentEntity } from "../domain/LikeComment.entity";
import { TLikeStatus } from "../../common/types";

export interface LikeCommentMethods {
  updateLikeStatus(newLikeStatus: TLikeStatus): void;
}

type LikeCommentStatics = typeof LikeCommentEntity;

export type TLikeCommentModel = Model<LikeCommentDb, {}, LikeCommentMethods> &
  LikeCommentStatics;

export type LikeCommentDocument = HydratedDocument<
  LikeCommentDb,
  LikeCommentMethods
>;

likeCommentSchema.loadClass(LikeCommentEntity);

export const LikeCommentModel = model<LikeCommentDb, TLikeCommentModel>(
  "LikeComment",
  likeCommentSchema,
);
