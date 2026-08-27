import { Comment } from "../types";

export const COMMENTS_PATH = "/comments";

export const COMMENTS_ROUTES = {
  ROOT: "",
  BY_ID: "/:id",
} as const;

export const COMMENT_FIELDS: (keyof Comment)[] = ["id", "content", "createdAt"];
