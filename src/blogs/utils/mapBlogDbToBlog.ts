import { Blog, BlogDb } from "../types";

export const mapBlogDbToBlog = (blogDb: BlogDb): Blog => ({
  id: blogDb._id.toString(),
  name: blogDb.name,
  description: blogDb.description,
  websiteUrl: blogDb.websiteUrl,
});
