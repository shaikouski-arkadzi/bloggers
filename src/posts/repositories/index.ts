import { db } from "../../db";
import { Post, PostDb, PostInputDto } from "../types";
import { blogRepository } from "../../blogs/repositories";
import { mapPostDbToPost } from "../utils";
import { ObjectId } from "mongodb";

export const postRepository = {
  async findAll(): Promise<Post[]> {
    const result = await db.getCollections().postsCollection.find({}).toArray();

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

  async create(post: PostInputDto): Promise<Post> {
    const blog = await blogRepository.findById(post.blogId);

    if (!blog) throw new Error("Не найдено блога с таким id");

    const newPost: PostDb = {
      _id: new ObjectId(),
      title: post.title,
      content: post.content,
      shortDescription: post.content,
      blogId: post.blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    await db.getCollections().postsCollection.insertOne(newPost);

    return mapPostDbToPost(newPost);
  },

  async update(id: string, post: PostInputDto): Promise<boolean> {
    const blog = await blogRepository.findById(post.blogId);

    const postById = await postRepository.findById(id);

    if (!postById) {
      return false;
    }

    // @ts-ignore
    const newPost = {
      // @ts-ignore
      title: postById.title,
      // @ts-ignore
      shortDescription: postById.shortDescription,
      // @ts-ignore
      content: postById.content,
      // @ts-ignore
      blogId: postById.blogId,
      ...post,
    };

    console.log("newPost:", JSON.stringify(newPost, null, 2));

    if (!blog) throw new Error("Не найдено блога с таким id");

    const result = await db.getCollections().postsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: newPost,
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
};
