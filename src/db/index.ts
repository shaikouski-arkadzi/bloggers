import { Blog } from "../blogs/types";

export interface DB {
  blogs: Blog[];
  posts: any[]; // TODO
}

export const db: DB = {
  blogs: [],
  posts: [],
};
