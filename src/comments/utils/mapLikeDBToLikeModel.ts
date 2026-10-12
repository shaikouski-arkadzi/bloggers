import { LikeDb, LikeModel } from "../types";
import { booleanToLikeStatus } from "./booleanToLikeStatus";

export const mapLikeDBToLikeModel = ({
  userId,
  commentId,
  like,
}: LikeDb): LikeModel => ({
  userId: userId.toString(),
  commentId: commentId.toString(),
  like: booleanToLikeStatus(like),
});
