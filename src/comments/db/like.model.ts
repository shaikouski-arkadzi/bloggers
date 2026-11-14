import { HydratedDocument, Model, model } from "mongoose";
import { LikeDb } from "../types";
import { likeSchema } from "./like.schema";
import { LikeEntity } from "../domain/Like.entity";

type LikeStatics = typeof LikeEntity;

export type TLikeModel = Model<LikeDb> & LikeStatics;

export type CommentDocument = HydratedDocument<LikeDb>;

likeSchema.loadClass(LikeEntity);

export const LikeModel = model<LikeDb, TLikeModel>("Like", likeSchema);
