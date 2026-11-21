import { TLikeStatus } from "../../common/types";
import { likeStatusToBoolean } from "../../common/utils/likeStatusToBoolean";
import { LikePostModel } from "../db/likePost.model";
import { createPostLikeDB } from "../utils";

export class LikePostEntity {
  private constructor(public like: boolean) {}

  static createLikeStatus(
    userId: string,
    postId: string,
    like: TLikeStatus,
  ): any {
    const likeDb = createPostLikeDB({ userId, postId, like });

    const likeModel = new LikePostModel(likeDb);

    return likeModel;
  }

  updateLikeStatus(newLikeStatus: TLikeStatus): void {
    this.like = likeStatusToBoolean(newLikeStatus);
  }
}
