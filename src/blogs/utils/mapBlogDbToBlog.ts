import { Types } from "mongoose";
import { Blog, BlogDb } from "../types";

export const mapBlogDbToBlog = (
  blogDb: BlogDb & { _id: Types.ObjectId },
): Blog => ({
  id: blogDb._id.toString(),
  name: blogDb.name,
  description: blogDb.description,
  websiteUrl: blogDb.websiteUrl,
  isMembership: blogDb.isMembership,
  createdAt: blogDb.createdAt,
});
