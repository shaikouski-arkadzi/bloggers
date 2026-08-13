import { db } from "../../db";
import { Post, PostDb, PostInputDto, UpdatedPost } from "../types";
import { blogRepository } from "../../blogs/repositories";
import { mapPostDbToPost } from "../utils";
import { ObjectId } from "mongodb";
import { SortDirection, SortBy } from "../../common/types";
import {
  PAGE_DAFAULT,
  PAGE_SIZE_DAFAULT,
  SORT_DIRECTION_DAFAULT,
  SORT_FIELD_DAFAULT,
} from "../../common/constants";

interface PostsQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy<Post>;
  sortDirection?: SortDirection;
}

export const postRepository = {
  async find({
    page = PAGE_DAFAULT,
    pageSize = PAGE_SIZE_DAFAULT,
    sortBy = SORT_FIELD_DAFAULT,
    sortDirection = SORT_DIRECTION_DAFAULT,
  }: PostsQueryParams = {}): Promise<PostDb[]> {
    const result = await db
      .getCollections()
      .postsCollection.find({})
      .sort({
        [sortBy]: sortDirection === "asc" ? 1 : -1,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return result;
  },

  async findById(id: string): Promise<PostDb | null> {
    const result = await db
      .getCollections()
      .postsCollection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return null;
    }

    return result;
  },

  async findPostsByBlog(
    blogId: string,
    {
      page = PAGE_DAFAULT,
      pageSize = PAGE_SIZE_DAFAULT,
      sortBy = SORT_FIELD_DAFAULT,
      sortDirection = SORT_DIRECTION_DAFAULT,
    }: PostsQueryParams = {},
  ): Promise<PostDb[]> {
    const result = await db
      .getCollections()
      .postsCollection.find({ blogId })
      .sort({
        [sortBy]: sortDirection === "asc" ? 1 : -1,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return result;
  },

  async create(post: PostDb): Promise<boolean> {
    await db.getCollections().postsCollection.insertOne(post);

    return true;
  },

  async update(id: ObjectId, post: UpdatedPost): Promise<number> {
    const result = await db.getCollections().postsCollection.updateOne(
      { _id: id },
      {
        $set: post,
      },
    );

    return result.matchedCount;
  },

  async delete(id: string): Promise<boolean> {
    const result = await db
      .getCollections()
      .postsCollection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  },

  async count(
    conditions: Partial<Record<keyof Post, string>> = {},
  ): Promise<number> {
    const filter = Object.fromEntries(
      Object.entries(conditions).map(([field, condition]) => [
        field,
        { $regex: condition, $options: "i" },
      ]),
    );

    const result = await db
      .getCollections()
      .postsCollection.countDocuments(filter);

    return result;
  },
};
