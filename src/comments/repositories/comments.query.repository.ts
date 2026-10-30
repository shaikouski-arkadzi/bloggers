import { Types } from "mongoose";
import { injectable } from "inversify";
import {
  PAGE_DAFAULT,
  PAGE_SIZE_DAFAULT,
  SORT_DIRECTION_DAFAULT,
  SORT_FIELD_DAFAULT,
} from "../../common/constants";
import { SortBy, SortDirection } from "../../common/types";
import { LikeModel } from "../db/like.model";
import { CommentModel } from "../db/comment.model";
import { Comment, CommentDb, TLikeStatus } from "../types";
import { booleanToLikeStatus } from "../utils";

interface CommentsQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy<Comment>;
  sortDirection?: SortDirection;
}

@injectable()
export class CommentsQueryRepository {
  async findCommentsByPost(
    postId: string,
    {
      page = PAGE_DAFAULT,
      pageSize = PAGE_SIZE_DAFAULT,
      sortBy = SORT_FIELD_DAFAULT,
      sortDirection = SORT_DIRECTION_DAFAULT,
    }: CommentsQueryParams = {},
  ): Promise<Array<CommentDb & { _id: Types.ObjectId }>> {
    const postObjectId = new Types.ObjectId(postId);

    const result = await CommentModel.find({ postId: postObjectId })
      .sort({
        [sortBy]: sortDirection === "asc" ? 1 : -1,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return result;
  }

  async findByField(
    filter: Partial<CommentDb & { _id: Types.ObjectId }>,
  ): Promise<(CommentDb & { _id: Types.ObjectId }) | null> {
    const result = await CommentModel.findOne(filter);

    if (!result) {
      return null;
    }

    return result;
  }

  async count(
    conditions: Partial<Record<keyof CommentDb, string | Types.ObjectId>> = {},
  ): Promise<number> {
    const filter = Object.fromEntries(
      Object.entries(conditions).map(([field, condition]) => [
        field,
        condition instanceof Types.ObjectId
          ? condition
          : { $regex: condition, $options: "i" },
      ]),
    );

    const result = await LikeModel.countDocuments(filter);

    return result;
  }

  async findLikeByUserAndComment(
    userId: string,
    commentId: string,
  ): Promise<TLikeStatus | null> {
    const result = await LikeModel.findOne({
      userId: new Types.ObjectId(userId),
      commentId: new Types.ObjectId(commentId),
    });

    if (!result) {
      return null;
    }

    return booleanToLikeStatus(result.like);
  }
}
