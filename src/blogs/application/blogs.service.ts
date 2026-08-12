import { ObjectId } from "mongodb";
import { blogRepository } from "../repositories";
import { mapBlogDbToBlog } from "../utils";
import { Blog, BlogDb, BlogInputDto } from "../types";

export const blogsService = {
  async findById(id: string): Promise<Blog | null> {
    const result = await blogRepository.findById(id);

    if (!result) {
      return null;
    }

    return mapBlogDbToBlog(result);
  },

  async create(blog: BlogInputDto): Promise<Blog> {
    const newBlogInDb: BlogDb = {
      _id: new ObjectId(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    await blogRepository.create(newBlogInDb);

    return mapBlogDbToBlog(newBlogInDb);
  },
};
