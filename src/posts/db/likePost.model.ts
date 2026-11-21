import { HydratedDocument, Model, model } from "mongoose";
import { TLikeStatus } from "../../common/types";
import { LikePostEntity } from "../domain/LikePost.entity";
import { LikePostDb } from "../types";
import { likePostSchema } from "./likePost.schema";

export interface LikePostMethods {
  updateLikeStatus(newLikeStatus: TLikeStatus): void;
}

type LikePostStatics = typeof LikePostEntity;

export type TLikePostModel = Model<LikePostDb, {}, LikePostMethods> &
  LikePostStatics;

export type LikePostDocument = HydratedDocument<LikePostDb, LikePostMethods>;

likePostSchema.loadClass(LikePostEntity);

export const LikePostModel = model<LikePostDb, TLikePostModel>(
  "LikePost",
  likePostSchema,
);
