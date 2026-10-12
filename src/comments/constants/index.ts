import { Comment } from "../types";

export const COMMENTS_PATH = "/comments";

export const COMMENTS_ROUTES = {
  ROOT: "",
  BY_ID: "/:id",
  BY_ID_LIKE_STATUS: "/:id/like-status",
} as const;

export const COMMENT_FIELDS: (keyof Comment)[] = ["id", "content", "createdAt"];

export const LikeStatus = {
  NONE: "None",
  LIKE: "Like",
  DISLIKE: "Dislike",
} as const;

export const INITIAL_LIKES_INFO = {
  likesCount: 0,
  dislikesCount: 0,
  myStatus: LikeStatus.NONE,
};
