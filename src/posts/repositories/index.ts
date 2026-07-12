import { randomUUID } from "node:crypto";
import { Post, PostInputDto } from "../types";
import { db } from "../../db";

export const postRepository = {
  findAll(): Post[] {
    return db.posts;
  },

  findById(id: string): Post | undefined {
    return db.posts.find((post) => post.id === id);
  },

  create(post: PostInputDto): Post {
    const newPost = {
      id: randomUUID(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: db.blogs.find((b) => b.id === post.blogId)!.name,
    };

    db.posts.push(newPost);

    console.log(db.posts);

    return newPost;
  },

  update(id: string, post: PostInputDto): boolean {
    const postIndex = db.posts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      return false;
    }

    db.posts[postIndex] = {
      ...db.posts[postIndex],
      ...post,
    };

    return true;
  },

  delete(id: string): boolean {
    const index = db.posts.findIndex((post) => post.id === id);

    if (index === -1) {
      return false;
    }

    db.posts.splice(index, 1);
    return true;
  },
};
