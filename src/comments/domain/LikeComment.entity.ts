import { LikeCommentDocument, LikeCommentModel } from "../db/likeComment.model";
import { TLikeStatus } from "../types";
import { createLikeDB, likeStatusToBoolean } from "../utils";

export class LikeCommentEntity {
  private constructor(public like: boolean) {}

  static createLikeStatus(
    userId: string,
    commentId: string,
    like: TLikeStatus,
  ): LikeCommentDocument {
    const likeDb = createLikeDB({ userId, commentId, like });

    const likeModel = new LikeCommentModel(likeDb);

    return likeModel;
  }

  updateLikeStatus(newLikeStatus: TLikeStatus): void {
    this.like = likeStatusToBoolean(newLikeStatus);
  }
}
