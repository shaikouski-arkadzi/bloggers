import { Blog } from "../types";

export const BLOGS_PATH = "/blogs";

export const BLOGS_ROUTES = {
  ROOT: "",
  BY_ID: "/:id",
  BLOG_POSTS: "/:id/posts",
} as const;

export const BLOG_FIELDS: (keyof Blog)[] = [
  "id",
  "name",
  "description",
  "websiteUrl",
  "isMembership",
  "createdAt",
];
