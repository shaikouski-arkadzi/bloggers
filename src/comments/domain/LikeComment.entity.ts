import { LikeCommentDocument, LikeCommentModel } from "../db/likeComment.model";
import { TLikeStatus } from "../../common/types";
import { likeStatusToBoolean } from "../../common/utils/likeStatusToBoolean";
import { createCommentLikeDB } from "../utils";

export class LikeCommentEntity {
  private constructor(public like: boolean) {}

  static createLikeStatus(
    userId: string,
    commentId: string,
    like: TLikeStatus,
  ): LikeCommentDocument {
    const likeDb = createCommentLikeDB({ userId, commentId, like });

    const likeModel = new LikeCommentModel(likeDb);

    return likeModel;
  }

  updateLikeStatus(newLikeStatus: TLikeStatus): void {
    this.like = likeStatusToBoolean(newLikeStatus);
  }
}
