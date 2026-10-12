import { LikeStatus } from "../constants";
import { TLikeStatus } from "../types";

export const booleanToLikeStatus = (isLiked: boolean): TLikeStatus => {
  return isLiked ? LikeStatus.LIKE : LikeStatus.DISLIKE;
};
