import { BlogDocument, BlogModel } from "../db/blog.model";
import { BlogInputDto } from "../types";

export class BlogEntity {
  private constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {}

  static createBlog(blogInput: BlogInputDto): BlogDocument {
    const blog = new BlogModel(blogInput);

    blog.isMembership = false;
    blog.createdAt = new Date().toISOString();

    return blog;
  }

  updateBlog(input: BlogInputDto): void {
    this.name = input.name;
    this.description = input.description;
    this.websiteUrl = input.websiteUrl;
  }
}
