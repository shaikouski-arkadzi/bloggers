import { injectable } from "inversify";
import { BlogModel } from "../db/blog.model";
import { Blog } from "../types";
import { SortDirection, SortBy } from "../../common/types";
import {
  PAGE_DAFAULT,
  PAGE_SIZE_DAFAULT,
  SORT_DIRECTION_DAFAULT,
  SORT_FIELD_DAFAULT,
} from "../../common/constants";
import { mapBlogDbToBlog } from "../utils";

interface BlogsQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy<Blog>;
  sortDirection?: SortDirection;
  searchNameTerm?: string | null;
}

@injectable()
export class BlogsQueryRepository {
  async find({
    page = PAGE_DAFAULT,
    pageSize = PAGE_SIZE_DAFAULT,
    sortBy = SORT_FIELD_DAFAULT,
    sortDirection = SORT_DIRECTION_DAFAULT,
    searchNameTerm = null,
  }: BlogsQueryParams = {}): Promise<Blog[]> {
    const result = await BlogModel.find(
      searchNameTerm
        ? {
            name: { $regex: searchNameTerm, $options: "i" },
          }
        : {},
    )
      .sort({
        [sortBy]: sortDirection === "asc" ? 1 : -1,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return result.map(mapBlogDbToBlog);
  }

  async findById(id: string): Promise<Blog | null> {
    const result = await BlogModel.findById(id);

    if (!result) {
      return null;
    }

    return mapBlogDbToBlog(result);
  }

  async count(
    conditions: Partial<Record<keyof Blog, string>> = {},
  ): Promise<number> {
    const filter = Object.fromEntries(
      Object.entries(conditions).map(([field, condition]) => [
        field,
        { $regex: condition, $options: "i" },
      ]),
    );

    const result = await BlogModel.countDocuments(filter);
    return result;
  }
}
