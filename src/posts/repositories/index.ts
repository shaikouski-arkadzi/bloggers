import { randomUUID } from "node:crypto";
import { postsCollection } from "../../db";
import { Post, PostInputDto } from "../types";
import { blogRepository } from "../../blogs/repositories";

export const postRepository = {
  async findAll(): Promise<Post[]> {
    return await postsCollection.find({}).toArray();
  },

  async findById(id: string): Promise<Post | null> {
    return await postsCollection.findOne({ id });
  },

  async create(post: PostInputDto): Promise<Post> {
    const blog = await blogRepository.findById(post.blogId);

    if (!blog) throw new Error("Не найдено блога с таким id");

    const newPost: Post = {
      id: randomUUID(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
    };

    await postsCollection.insertOne(newPost);

    return newPost;
  },

  async update(id: string, post: PostInputDto): Promise<boolean> {
    const blog = await blogRepository.findById(post.blogId);

    if (!blog) throw new Error("Не найдено блога с таким id");

    const result = await postsCollection.updateOne(
      { id },
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
    const result = await postsCollection.deleteOne({ id });

    return result.deletedCount === 1;
  },
};
