import { ObjectId } from "mongodb";
import { db } from "../../db";
import { Blog, BlogDb, BlogInputDto } from "../types";
import { mapBlogDbToBlog } from "../utils";

export const blogRepository = {
  async findAll(): Promise<Blog[]> {
    const result = await db.getCollections().blogsCollection.find({}).toArray();

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
};
