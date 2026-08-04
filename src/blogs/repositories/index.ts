import { ObjectId } from "mongodb";
import { db } from "../../db";
import { Blog, BlogDb, BlogInputDto, SortBy } from "../types";
import { mapBlogDbToBlog } from "../utils";
import { SortDirection } from "../../common/types";

export const blogRepository = {
  async find(
    page: number = 1,
    pageSize: number = 10,
    sortBy: SortBy = "createdAt",
    sortDirection: SortDirection = "desc",
  ): Promise<Blog[]> {
    const result = await db
      .getCollections()
      .blogsCollection.find({})
      .sort({
        [sortBy]: sortDirection === "asc" ? 1 : -1,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return result.map(mapBlogDbToBlog);
  },

  async findById(id: string): Promise<Blog | null> {
    const result = await db
      .getCollections()
      .blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return null;
    }

    return mapBlogDbToBlog(result);
  },

  async create(blog: BlogInputDto): Promise<Blog> {
    const newBlog: BlogDb = {
      _id: new ObjectId(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    await db.getCollections().blogsCollection.insertOne(newBlog);

    return mapBlogDbToBlog(newBlog);
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

  async count(): Promise<number> {
    const result = await db.getCollections().blogsCollection.countDocuments({});

    return result;
  },
};
