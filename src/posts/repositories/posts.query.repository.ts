import { Types } from "mongoose";
import { injectable } from "inversify";
import { Post } from "../types";
import { SortDirection, SortBy, TLikeStatus } from "../../common/types";
import {
  PAGE_DAFAULT,
  PAGE_SIZE_DAFAULT,
  SORT_DIRECTION_DAFAULT,
  SORT_FIELD_DAFAULT,
} from "../../common/constants";
import { mapPostDbToPost } from "../utils";
import { PostModel } from "../db/post.model";
import { LikePostModel } from "../db/likePost.model";
import { booleanToLikeStatus } from "../../common/utils/booleanToLikeStatus";

interface PostsQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy<Post>;
  sortDirection?: SortDirection;
}

@injectable()
export class PostsQueryRepository {
  async find({
    page = PAGE_DAFAULT,
    pageSize = PAGE_SIZE_DAFAULT,
    sortBy = SORT_FIELD_DAFAULT,
    sortDirection = SORT_DIRECTION_DAFAULT,
  }: PostsQueryParams = {}): Promise<Post[]> {
    const result = await PostModel.find({})
      .sort({
        [sortBy]: sortDirection === "asc" ? 1 : -1,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return result.map(mapPostDbToPost);
  }

  async findById(id: string): Promise<Post | null> {
    const result = await PostModel.findById(id);

    if (!result) {
      return null;
    }

    return mapPostDbToPost(result);
  }

  async findPostsByBlog(
    blogId: string,
    {
      page = PAGE_DAFAULT,
      pageSize = PAGE_SIZE_DAFAULT,
      sortBy = SORT_FIELD_DAFAULT,
      sortDirection = SORT_DIRECTION_DAFAULT,
    }: PostsQueryParams = {},
  ): Promise<Post[]> {
    const result = await PostModel.find({ blogId })
      .sort({
        [sortBy]: sortDirection === "asc" ? 1 : -1,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return result.map(mapPostDbToPost);
  }

  async count(
    conditions: Partial<Record<keyof Post, string>> = {},
  ): Promise<number> {
    const filter = Object.fromEntries(
      Object.entries(conditions).map(([field, condition]) => [
        field,
        { $regex: condition, $options: "i" },
      ]),
    );

    const result = await PostModel.countDocuments(filter);

    return result;
  }

  async findLikeByUserAndPost(
    userId: string,
    postId: string,
  ): Promise<TLikeStatus | null> {
    const result = await LikePostModel.findOne({
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId),
    });

    if (!result) {
      return null;
    }

    return booleanToLikeStatus(result.like);
  }
}
