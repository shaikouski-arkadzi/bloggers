import { randomUUID } from "node:crypto";
import { blogsCollection } from "../../db";
import { Blog } from "../types";

export const blogRepository = {
  async findAll(): Promise<Blog[]> {
    return await blogsCollection.find({}).toArray();
  },

  async findById(id: string): Promise<Blog | null> {
    return await blogsCollection.findOne({ id });
  },

  async create(blog: Omit<Blog, "id">): Promise<Blog> {
    const newBlog: Blog = {
      id: randomUUID(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
    };

    await blogsCollection.insertOne(newBlog);

    return newBlog;
  },

  async update(id: string, blog: Omit<Blog, "id">): Promise<boolean> {
    const result = await blogsCollection.updateOne(
      { id },
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
    const result = await blogsCollection.deleteOne({ id });

    return result.deletedCount === 1;
  },
};
