import { LikeDocument, LikeModel } from "../db/like.model";
import { TLikeStatus } from "../types";
import { createLikeDB } from "../utils";

export class LikeEntity {
  static createLikeStatus(
    userId: string,
    commentId: string,
    like: TLikeStatus,
  ): LikeDocument {
    const likeDb = createLikeDB({ userId, commentId, like });

    const likeModel = new LikeModel(likeDb);

    return likeModel;
  }
}
