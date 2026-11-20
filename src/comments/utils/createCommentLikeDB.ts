import { Types } from "mongoose";
import { LikeCommentDb, LikeCommentModel } from "../types";
import { likeStatusToBoolean } from "../../common/utils/likeStatusToBoolean";

export const createCommentLikeDB = ({
  userId,
  commentId,
  like,
}: LikeCommentModel): LikeCommentDb => ({
  userId: new Types.ObjectId(userId),
  commentId: new Types.ObjectId(commentId),
  like: likeStatusToBoolean(like),
});
