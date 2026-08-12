import { ObjectId } from "mongodb";
import { blogRepository } from "../../blogs/repositories";
import { postRepository } from "../repositories";
import { Post, PostDb, PostInputDto } from "../types";
import { mapPostDbToPost } from "../utils";

export const postsService = {
  async findById(id: string): Promise<Post | null> {
    const result = await postRepository.findById(id);

    if (!result) {
      return null;
    }

    return mapPostDbToPost(result);
  },

  async create(post: PostInputDto): Promise<Post | Error> {
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

    const result = await postRepository.create(newPost);

    if (result) {
      return mapPostDbToPost(newPost);
    } else {
      throw new Error("Ошибка создания поста");
    }
  },
};
