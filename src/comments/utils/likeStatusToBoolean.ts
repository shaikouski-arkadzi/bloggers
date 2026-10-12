import { LikeStatus } from "../constants";
import { TLikeStatus } from "../types";

export const likeStatusToBoolean = (likeStatus: TLikeStatus): boolean => {
  return likeStatus === LikeStatus.LIKE;
};
