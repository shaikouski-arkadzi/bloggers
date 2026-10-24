import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { db } from "../../db";
import { Post } from "../types";
import { SortDirection, SortBy } from "../../common/types";
import {
  PAGE_DAFAULT,
  PAGE_SIZE_DAFAULT,
  SORT_DIRECTION_DAFAULT,
  SORT_FIELD_DAFAULT,
} from "../../common/constants";
import { mapPostDbToPost } from "../utils";
import { PostModel } from "../db/post.model";

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
}
