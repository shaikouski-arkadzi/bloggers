import { WithId } from "mongodb";
import { Blog, BlogDb } from "../types";

export const mapBlogDbToBlog = (blogDb: WithId<BlogDb>): Blog => ({
  id: blogDb._id.toString(),
  name: blogDb.name,
  description: blogDb.description,
  websiteUrl: blogDb.websiteUrl,
  isMembership: blogDb.isMembership,
  createdAt: blogDb.createdAt,
});
