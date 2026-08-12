import { ObjectId } from "mongodb";
import { db } from "../../db";
import { Blog, BlogDb, BlogInputDto } from "../types";
import { mapBlogDbToBlog } from "../utils";
import { SortDirection, SortBy } from "../../common/types";
import {
  PAGE_DAFAULT,
  PAGE_SIZE_DAFAULT,
  SORT_DIRECTION_DAFAULT,
  SORT_FIELD_DAFAULT,
} from "../../common/constants";

interface BlogsQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy<Blog>;
  sortDirection?: SortDirection;
  searchNameTerm?: string | null;
}

export const blogRepository = {
  async find({
    page = PAGE_DAFAULT,
    pageSize = PAGE_SIZE_DAFAULT,
    sortBy = SORT_FIELD_DAFAULT,
    sortDirection = SORT_DIRECTION_DAFAULT,
    searchNameTerm = null,
  }: BlogsQueryParams = {}): Promise<Blog[]> {
    const result = await db
      .getCollections()
      .blogsCollection.find(
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
      .limit(pageSize)
      .toArray();

    return result.map(mapBlogDbToBlog);
  },

  async findById(id: string): Promise<BlogDb | null> {
    const result = await db
      .getCollections()
      .blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return null;
    }

    return result;
  },

  async create(blog: BlogDb): Promise<void> {
    await db.getCollections().blogsCollection.insertOne(blog);
  },

  async update(id: string, blog: BlogInputDto): Promise<boolean> {
    const result = await db.getCollections().blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: blog.name,
          description: blog.description,
          websiteUrl: blog.websiteUrl,
        },
      },
    );

    return result.matchedCount === 1;
  },

  async delete(id: string): Promise<boolean> {
    const result = await db
      .getCollections()
      .blogsCollection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  },

  async count(
    conditions: Partial<Record<keyof Blog, string>> = {},
  ): Promise<number> {
    const filter = Object.fromEntries(
      Object.entries(conditions).map(([field, condition]) => [
        field,
        { $regex: condition, $options: "i" },
      ]),
    );

    const result = await db
      .getCollections()
      .blogsCollection.countDocuments(filter);

    return result;
  },
};
