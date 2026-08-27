import { ObjectId } from "mongodb";
import {
  PAGE_DAFAULT,
  PAGE_SIZE_DAFAULT,
  SORT_DIRECTION_DAFAULT,
  SORT_FIELD_DAFAULT,
} from "../../common/constants";
import { SortBy, SortDirection } from "../../common/types";
import { db } from "../../db";
import { Comment } from "../types";
import { mapCommentDbToComment } from "../utils";

interface CommentsQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy<Comment>;
  sortDirection?: SortDirection;
}

export const commentsQueryRepository = {
  async findCommentsByPost(
    postId: string,
    {
      page = PAGE_DAFAULT,
      pageSize = PAGE_SIZE_DAFAULT,
      sortBy = SORT_FIELD_DAFAULT,
      sortDirection = SORT_DIRECTION_DAFAULT,
    }: CommentsQueryParams = {},
  ): Promise<Comment[]> {
    const postObjectId = new ObjectId(postId);
    const result = await db
      .getCollections()
      .commentsCollection.find({ postId: postObjectId })
      .sort({
        [sortBy]: sortDirection === "asc" ? 1 : -1,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return result.map(mapCommentDbToComment);
  },

  async count(
    conditions: Partial<Record<keyof Comment, string>> = {},
  ): Promise<number> {
    const filter = Object.fromEntries(
      Object.entries(conditions).map(([field, condition]) => [
        field,
        { $regex: condition, $options: "i" },
      ]),
    );

    const result = await db
      .getCollections()
      .commentsCollection.countDocuments(filter);

    return result;
  },
};
