import { HydratedDocument, Model, model } from "mongoose";
import { LikeDb, TLikeStatus } from "../types";
import { likeSchema } from "./like.schema";
import { LikeEntity } from "../domain/Like.entity";

export interface LikeMethods {
  updateLikeStatus(newLikeStatus: TLikeStatus): void;
}

type LikeStatics = typeof LikeEntity;

export type TLikeModel = Model<LikeDb, {}, LikeMethods> & LikeStatics;

export type LikeDocument = HydratedDocument<LikeDb, LikeMethods>;

likeSchema.loadClass(LikeEntity);

export const LikeModel = model<LikeDb, TLikeModel>("Like", likeSchema);
