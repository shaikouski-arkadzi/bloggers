import { BlogDb, BlogInputDto } from "../types";

export class BlogEntity {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: string;

  private constructor(
    name: string,
    description: string,
    websiteUrl: string,
    isMembership: boolean,
    createdAt: string,
  ) {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.isMembership = false;
    this.createdAt = createdAt;
  }

  static createBlog(blog: BlogInputDto): BlogDb {
    return {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
  }
}
