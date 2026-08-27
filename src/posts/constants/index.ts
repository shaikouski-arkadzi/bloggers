import { Post } from "../types";

export const POSTS_PATH = "/posts";

export const POSTS_ROUTES = {
  ROOT: "",
  BY_ID: "/:id",
  POST_COMMENTS: "/:id/comments",
} as const;

export const POST_FIELDS: (keyof Post)[] = [
  "id",
  "title",
  "shortDescription",
  "content",
  "blogId",
  "blogName",
  "createdAt",
];
