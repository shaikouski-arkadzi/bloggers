import { HydratedDocument, Model, model } from "mongoose";
import { BlogDb } from "../types";
import { BlogEntity } from "../domain/Blog.entity";
import { blogSchema } from "./blog.schema";

type BlogStatics = typeof BlogEntity;

export type TBlogModel = Model<BlogDb> & BlogStatics;

export type BlogDocument = HydratedDocument<BlogDb>;

blogSchema.loadClass(BlogEntity);

export const BlogModel = model<BlogDb, TBlogModel>("Blog", blogSchema);
