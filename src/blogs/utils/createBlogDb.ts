import { BlogDb, BlogInputDto } from "../types";

export const createBlogDb = (blog: BlogInputDto): BlogDb => ({
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  isMembership: false,
  createdAt: new Date().toISOString(),
});
