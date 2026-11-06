import { BlogDocument, BlogModel } from "../db/blog.model";
import { BlogInputDto } from "../types";

export class BlogEntity {
  static createBlog(blogInput: BlogInputDto): BlogDocument {
    const blog = new BlogModel(blogInput);

    blog.isMembership = false;
    blog.createdAt = new Date().toISOString();

    return blog;
  }
}
