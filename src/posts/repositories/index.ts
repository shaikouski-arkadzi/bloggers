import { db } from "../../db";
import { Post, PostDb, PostInputDto } from "../types";
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
  }: PostsQueryParams = {}): Promise<Post[]> {
    const result = await db
      .getCollections()
      .postsCollection.find({})
      .sort({
        [sortBy]: sortDirection === "asc" ? 1 : -1,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return result.map(mapPostDbToPost);
  },

  async findById(id: string): Promise<Post | null> {
    const result = await db
      .getCollections()
      .postsCollection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return null;
    }

    return mapPostDbToPost(result);
  },

  async findPostsByBlog(
    blogId: string,
    {
      page = PAGE_DAFAULT,
      pageSize = PAGE_SIZE_DAFAULT,
      sortBy = SORT_FIELD_DAFAULT,
      sortDirection = SORT_DIRECTION_DAFAULT,
    }: PostsQueryParams = {},
  ): Promise<Post[]> {
    const result = await db
      .getCollections()
      .postsCollection.find({ blogId })
      .sort({
        [sortBy]: sortDirection === "asc" ? 1 : -1,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return result.map(mapPostDbToPost);
  },

  async create(post: PostInputDto): Promise<Post> {
    const blog = await blogRepository.findById(post.blogId);

    if (!blog) throw new Error("Не найдено блога с таким id");

    const newPost: PostDb = {
      _id: new ObjectId(),
      title: post.title,
      content: post.content,
      shortDescription: post.shortDescription,
      blogId: post.blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    await db.getCollections().postsCollection.insertOne(newPost);

    return mapPostDbToPost(newPost);
  },

  async update(id: string, post: PostInputDto): Promise<boolean> {
    const blog = await blogRepository.findById(post.blogId);

    if (!blog) throw new Error("Не найдено блога с таким id");

    const result = await db.getCollections().postsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: blog.name,
        },
      },
    );

    return result.matchedCount === 1;
  },

  async delete(id: string): Promise<boolean> {
    const result = await db
      .getCollections()
      .postsCollection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  },

  async count({
    field,
    condition,
  }: {
    field?: keyof Post;
    condition?: string;
  } = {}): Promise<number> {
    const result = await db.getCollections().postsCollection.countDocuments(
      field
        ? {
            [field]: { $regex: condition },
          }
        : {},
    );

    return result;
  },
};
