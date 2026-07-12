import { randomUUID } from "node:crypto";
import { Blog } from "../types";
import { db } from "../../db";

export const blogRepository = {
  findAll(): Blog[] {
    return db.blogs;
  },

  findById(id: string): Blog | undefined {
    return db.blogs.find((blog) => blog.id === id);
  },

  create(blog: Omit<Blog, "id">): Blog {
    const newBlog = {
      id: randomUUID(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
    };

    db.blogs.push(newBlog);

    console.log(db.blogs);

    return newBlog;
  },

  update(id: string, blog: Omit<Blog, "id">): boolean {
    const blogIndex = db.blogs.findIndex((b) => b.id === id);

    if (blogIndex === -1) {
      return false;
    }

    db.blogs[blogIndex] = {
      ...db.blogs[blogIndex],
      ...blog,
    };

    return true;
  },

  delete(id: string): boolean {
    const index = db.blogs.findIndex((blog) => blog.id === id);

    if (index === -1) {
      return false;
    }

    db.blogs.splice(index, 1);
    return true;
  },
};
