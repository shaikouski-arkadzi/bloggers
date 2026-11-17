import { LikeDocument, LikeModel } from "../db/like.model";
import { TLikeStatus } from "../types";
import { createLikeDB, likeStatusToBoolean } from "../utils";

export class LikeEntity {
  private constructor(public like: boolean) {}

  static createLikeStatus(
    userId: string,
    commentId: string,
    like: TLikeStatus,
  ): LikeDocument {
    const likeDb = createLikeDB({ userId, commentId, like });

    const likeModel = new LikeModel(likeDb);

    return likeModel;
  }

  updateLikeStatus(newLikeStatus: TLikeStatus): void {
    this.like = likeStatusToBoolean(newLikeStatus);
  }
}
