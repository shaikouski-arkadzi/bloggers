import { Blog } from "../blogs/types";
import { Post } from "../posts/types";

export interface DB {
  blogs: Blog[];
  posts: Post[];
}

export const db: DB = {
  blogs: [],
  posts: [],
};
