import { model } from "mongoose";
import { LikeDb } from "../types";
import { likeSchema } from "./like.schema";

export const LikeModel = model<LikeDb>("Like", likeSchema);
