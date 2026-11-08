import { HydratedDocument, Model, model } from "mongoose";
import { BlogDb, BlogInputDto } from "../types";
import { BlogEntity } from "../domain/Blog.entity";
import { blogSchema } from "./blog.schema";

export interface BlogMethods {
  updateBlog(input: BlogInputDto): void;
}

type BlogStatics = typeof BlogEntity;

export type TBlogModel = Model<BlogDb, {}, BlogMethods> & BlogStatics;

export type BlogDocument = HydratedDocument<BlogDb, BlogMethods>;

blogSchema.loadClass(BlogEntity);

export const BlogModel = model<BlogDb, TBlogModel>("Blog", blogSchema);
