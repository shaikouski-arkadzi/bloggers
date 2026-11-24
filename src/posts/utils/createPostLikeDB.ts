import { Types } from "mongoose";
import { LikeCommentModel, LikePostDb } from "../types";
import { likeStatusToBoolean } from "../../common/utils/likeStatusToBoolean";

export const createPostLikeDB = ({
  userId,
  postId,
  like,
}: LikeCommentModel): LikePostDb => ({
  userId: new Types.ObjectId(userId),
  postId: new Types.ObjectId(postId),
  like: likeStatusToBoolean(like),
  createdAt: new Date().toISOString(),
});
