import { Types } from "mongoose";
import { LikeDb, LikeModel } from "../types";
import { likeStatusToBoolean } from "./likeStatusToBoolean";

export const mapLikeModelToLikeDB = ({
  userId,
  commentId,
  like,
}: LikeModel): LikeDb => ({
  userId: new Types.ObjectId(userId),
  commentId: new Types.ObjectId(commentId),
  like: likeStatusToBoolean(like),
});
