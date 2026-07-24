import { ObjectId } from "mongodb";
import { blogsCollection } from "../../db";
import { Blog, BlogDb, BlogInputDto } from "../types";
import { mapBlogDbToBlog } from "../utils";

export const blogRepository = {
  async findAll(): Promise<Blog[]> {
    const result = await blogsCollection.find({}).toArray();

    return result.map(mapBlogDbToBlog);
  },

  async findById(id: string): Promise<Blog | null> {
    const result = await blogsCollection.findOne({ _id: new ObjectId(id) });

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

    await blogsCollection.insertOne(newBlog);

    return mapBlogDbToBlog(newBlog);
  },

  async update(id: string, blog: BlogInputDto): Promise<boolean> {
    const result = await blogsCollection.updateOne(
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
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  },
};
