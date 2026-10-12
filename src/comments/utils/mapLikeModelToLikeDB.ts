import { ObjectId } from "mongodb";
import { LikeDb, LikeModel } from "../types";
import { likeStatusToBoolean } from "./likeStatusToBoolean";

export const mapLikeModelToLikeDB = ({
  userId,
  commentId,
  like,
}: LikeModel): LikeDb => ({
  userId: new ObjectId(userId),
  commentId: new ObjectId(commentId),
  like: likeStatusToBoolean(like),
});
